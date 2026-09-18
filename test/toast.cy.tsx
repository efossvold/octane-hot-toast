import { mount } from 'cypress-ct-octane-js'
import { useEffect, useState } from 'octane'

import { CheckmarkIcon, ErrorIcon, resolveValue, toast, Toaster, ToastIcon } from '../src'
import { defaultTimeouts } from '../src/core/store'
import { REMOVE_DELAY } from '../src/core/use-toaster'

declare global {
  namespace Cypress {
    interface Chainable {
      getToast(): Chainable<{ toast: typeof toast }>
    }
  }
}

Cypress.Commands.addQuery('getToast', function () {
  return () => ({ toast })
})

const getId = () => Math.random().toString(36).substring(2, 11)

describe('Toast tests', () => {
  beforeEach(() => {
    // Tests should run in serial for improved isolation
    // To prevent collision with global state, reset all toasts for each test
    toast.remove()

    // Reset timer
    // Need fix (new Date) from https://github.com/cypress-io/cypress/issues/31320#issuecomment-3239143027 for timer to work correctly
    cy.clock(new Date().getTime(), ['Date'])
  })

  describe('Single Toaster behavior', () => {
    it('should succeed', () => {
      mount(
        <>
          <ErrorIcon />
          <CheckmarkIcon />
          <Toaster />
        </>,
      )
    })

    it('should dismiss toast', () => {
      const toasterId = getId()

      mount(
        <>
          <button
            type="button"
            onClick={() => {
              toast.success(
                t => (
                  <div>
                    Example
                    <button
                      aria-hidden={!t.visible}
                      type="button"
                      title="close"
                      onClick={() => toast.dismiss(t.id, toasterId)}
                    >
                      Close
                    </button>
                  </div>
                ),
                { toasterId },
              )
            }}
          >
            Notify!
          </button>
          <Toaster toasterId={toasterId} />
        </>,
      )

      cy.contains('button', 'Notify!').click()
      cy.contains('Example').should('be.visible')
      cy.contains('button', 'Close').click()
      cy.contains('Example').should('not.exist')
    })

    it('should create a promise success toast which resolves', () => {
      const WAIT_DELAY = 1000

      mount(
        <>
          <button
            type="button"
            onClick={async () => {
              const sleep = new Promise(resolve => {
                setTimeout(resolve, WAIT_DELAY)
              })

              await toast.promise(sleep, {
                loading: 'Loading...',
                success: 'Success!',
              })
            }}
          >
            Notify!
          </button>
          <Toaster />
        </>,
      )

      cy.contains('button', 'Notify!').click()
      cy.contains('Loading...').should('be.visible')
      cy.tick(WAIT_DELAY)
      cy.contains('Success!').should('be.visible')
    })

    it('should create a promise error toast which rejects', () => {
      const WAIT_DELAY = 1000

      const onClick = async () => {
        const sleep = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('rejected'))
          }, WAIT_DELAY)
        })

        await toast.promise(sleep, {
          loading: 'Loading...',
          error: 'Error!',
        })
      }

      mount(
        <>
          <button type="button" onClick={onClick}>
            Notify!
          </button>
          <Toaster />
        </>,
      )

      cy.contains('button', 'Notify!').click()
      cy.contains('Loading...').should('be.visible')
      cy.tick(WAIT_DELAY)
      cy.contains('Error!').should('be.visible')
    })

    it('should show a toast with custom duration', () => {
      const TOAST_DURATION = 2000
      const toasterId = getId()

      mount(
        <>
          <button
            type="button"
            onClick={() => {
              toast.error('An error happened', {
                toasterId,
                duration: TOAST_DURATION,
              })
            }}
          >
            Notify!
          </button>
          <Toaster toasterId={toasterId} position="bottom-right" />
        </>,
      )

      cy.contains('button', 'Notify!').click()
      cy.contains('error').should('be.visible')

      cy.log('Toast should not be visible when duration expires')
      cy.tick(TOAST_DURATION)
      cy.contains('error').should('not.be.visible')
      cy.contains('error').should('exist')

      cy.log('Toast should be removed from DOM after remove delay')
      cy.tick(REMOVE_DELAY)
      cy.contains('error').should('not.exist')
    })

    it('should show different toast types with dismiss', () => {
      let loadingToastId: string

      mount(<Toaster />)

      cy.getToast().then(t => {
        t.toast.success('Success!')
        t.toast.error('Error!')

        t.toast('Emoji Icon', {
          icon: '✅',
          removeDelay: 9999999,
        })

        t.toast('Custom Icon', {
          icon: <span>ICON</span>,
        })

        loadingToastId = toast.loading('Loading!')
      })

      cy.contains('Success!').should('be.visible')
      cy.contains('Error!').should('be.visible')
      cy.contains('✅').should('be.visible')
      cy.contains('Loading!').should('be.visible')
      cy.contains('ICON').should('be.visible')

      cy.log('Wait for default success timeout')
      cy.tick(defaultTimeouts.success)
      cy.contains('Success!').should('not.be.visible')
      cy.contains('Error!').should('be.visible')
      cy.contains('Loading!').should('be.visible')

      cy.log('Wait for default error timeout')
      cy.tick(defaultTimeouts.error - defaultTimeouts.success)

      cy.contains('Error!').should('not.be.visible')

      cy.getToast().then(t => {
        t.toast.dismiss(loadingToastId)
        cy.contains('Loading!').should('not.be.visible')
      })
    })

    it('toaster with custom renderer should show toast', () => {
      mount(
        <Toaster>
          {t => (
            <div className="custom-toast">
              <ToastIcon toast={t} />
              {resolveValue(t.message, t)}
            </div>
          )}
        </Toaster>,
      )

      cy.getToast().then(t => {
        t.toast.success('Success!')
        t.toast(<b>Bold</b>)
        t.toast.custom('Custom')
      })

      cy.contains('Success!').should('be.visible').and('have.class', 'custom-toast')
      cy.contains('Bold').should('be.visible')
      cy.contains('Custom').should('be.visible').and('not.have.class', 'custom-toast')
    })

    it('should pause toast on hover', () => {
      mount(
        <Toaster>
          {t => (
            <div className="custom-toast">
              <ToastIcon toast={t} />
              {resolveValue(t.message, t)}
            </div>
          )}
        </Toaster>,
      )

      cy.getToast().then(t => {
        t.toast.success('Hover me!', {
          duration: 1000,
        })
      })

      cy.contains('Hover me!').should('be.visible').trigger('mouseenter')

      cy.tick(1000)
      cy.contains('Hover me!').should('be.visible')
      cy.contains('Hover me!').trigger('mouseleave')

      cy.tick(1000 + REMOVE_DELAY)
      cy.contains('Hover me!').should('not.exist')
    })

    it('should open toast from useEffect hook', () => {
      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const MyComponent = () => {
        const [success, setSuccess] = useState(false)

        useEffect(() => {
          toast.success('Success toast')
          setSuccess(true)
        }, [])

        return success ? <div>MyComponent finished</div> : null
      }

      mount(
        <>
          <MyComponent />
          <Toaster />
        </>,
      )

      cy.contains('MyComponent finished').should('be.visible')
      cy.contains('Success toast').should('be.visible')
    })
  })

  describe('Multi-Toaster behavior', () => {
    it('renders toasts in correct containers and dismisses them individually', () => {
      cy.clock()

      mount(
        <>
          <Toaster position="top-left" containerClassName="default-toaster" />
          <Toaster
            position="top-right"
            toasterId="second-toaster"
            containerClassName="second-toaster"
          />
          <Toaster
            position="bottom-center"
            toasterId="third-toaster"
            containerClassName="third-toaster"
          />
        </>,
      )

      // Show three toasts in three different toasters
      cy.getToast().then(t => {
        t.toast.success('Default toaster message')
        t.toast.error('Second toaster message', {
          toasterId: 'second-toaster',
          id: 'second-toast',
        })
        t.toast.loading('Third toaster message', {
          toasterId: 'third-toaster',
        })
      })

      // Ensure each toast is present in the correct container
      cy.get('.default-toaster').contains('Default toaster message').should('be.visible')

      cy.get('.second-toaster').contains('Second toaster message').should('be.visible')

      cy.get('.third-toaster').contains('Third toaster message').should('be.visible')

      // Dismiss only the toast in the second toaster

      cy.getToast().then(t => {
        t.toast.dismiss('second-toast')
      })

      cy.tick(REMOVE_DELAY)
      cy.contains('Second toaster message').should('not.be.visible')
      cy.contains('Default toaster message').should('be.visible')
      cy.contains('Third toaster message').should('be.visible')

      // Dismiss all toasts
      cy.getToast().then(t => {
        t.toast.dismissAll()
      })

      cy.tick(REMOVE_DELAY)
      cy.contains('Default toaster message').should('not.be.visible')
      cy.contains('Second toaster message').should('not.be.visible')
      cy.contains('Third toaster message').should('not.be.visible')
    })
  })

  it('updates a toast in a specific toaster without affecting others', () => {
    mount(
      <>
        <Toaster containerClassName="default-toaster" />
        <Toaster toasterId="updatable-toaster" containerClassName="updatable-toaster" />
      </>,
    )

    // Create a loading toast in the second toaster
    let toastId: string

    cy.getToast().then(t => {
      toastId = t.toast.loading('Please wait...', {
        toasterId: 'updatable-toaster',
      })
    })

    cy.get('.updatable-toaster').contains('Please wait...').should('be.visible')

    // Update that toast to success
    // Note that we are not providing a toasterId here
    cy.getToast().then(t => {
      t.toast.success('Data saved!', {
        id: toastId,
      })
    })

    cy.contains('Please wait...').should('not.exist')

    cy.get('.updatable-toaster').contains('Data saved!').should('be.visible')
  })

  it('dismisses all toasts from a specific toaster and leaves others intact', () => {
    cy.clock()

    mount(
      <>
        <Toaster containerClassName="default-toaster" />
        <Toaster
          toasterId="other-toaster"
          containerClassName="other-toaster"
          position="bottom-center"
        />
      </>,
    )

    // Create one toast in each toaster
    cy.getToast().then(t => {
      t.toast.success('Default toaster toast')
      t.toast.success('Other toaster toast', {
        toasterId: 'other-toaster',
      })
    })

    // Ensure both appear
    cy.contains('Default toaster toast').should('be.visible')
    cy.contains('Other toaster toast').should('be.visible')

    // Dismiss only the second toaster's toasts
    cy.getToast().then(t => {
      t.toast.dismissAll('other-toaster')
    })

    cy.tick(REMOVE_DELAY)

    // The other toaster's toast should be gone, default remains
    cy.contains('Other toaster toast').should('not.exist')
    cy.contains('Default toaster toast').should('be.visible')
  })

  it('dismisses all toasts across all toasters with dismissAll', () => {
    cy.clock()

    mount(
      <>
        <Toaster containerClassName="default-toaster" />
        <Toaster toasterId="other-toaster" containerClassName="other-toaster" />
      </>,
    )

    // Create one toast in each toaster
    cy.getToast().then(t => {
      t.toast.success('Default toaster toast')
      t.toast.error('Other toaster toast', {
        toasterId: 'other-toaster',
      })
      t.toast.dismissAll()
    })

    // Dismiss every toast in all toasters
    cy.tick(REMOVE_DELAY)

    // Both should be removed
    cy.contains('Default toaster toast').should('not.be.visible')
    cy.contains('Other toaster toast').should('not.be.visible')
  })

  it('removes toasts immediately when calling toast.remove()', () => {
    mount(
      <>
        <Toaster toasterId="instant-remove-toaster" />
        <Toaster toasterId="another-toaster" />
      </>,
    )

    cy.getToast().then(t => {
      t.toast.success('Removable toast #1', {
        toasterId: 'instant-remove-toaster',
      })
      t.toast.error('Removable toast #2', {
        toasterId: 'another-toaster',
      })
    })

    cy.contains('Removable toast #1').should('be.visible')
    cy.contains('Removable toast #2').should('be.visible')

    cy.getToast().then(t => {
      t.toast.removeAll('instant-remove-toaster')
    })

    cy.contains('Removable toast #1').should('not.exist')
    cy.contains('Removable toast #2').should('be.visible')
  })
})
