import { render, screen, act, waitFor, fireEvent } from '@octanejs/testing-library'
import { useEffect, useState } from 'octane'
import { beforeEach, test, afterEach, describe, expect, it } from 'vitest'

import { toast, resolveValue, Toaster, ToastIcon } from '../src'
import { defaultTimeouts } from '../src/core/store'
import { REMOVE_DELAY } from '../src/core/use-toaster'

beforeEach(() => {
  // Tests should run in serial for improved isolation
  // To prevent collision with global state, reset all toasts for each test
  toast.remove()
  vi.useFakeTimers()
})

afterEach(async () => {
  await act(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })
})

const waitTime = async (time: number) =>
  await act(() => {
    vi.advanceTimersByTime(time)
  })

const TOAST_DURATION = 1000

test('close notification', async () => {
  render(
    <>
      <button
        type="button"
        onClick={() => {
          toast.success(t => (
            <div>
              Example
              <button
                aria-hidden={!t.visible}
                type="button"
                onClick={() => {
                  toast.dismiss(t.id)
                }}
                title="close"
              >
                Close
              </button>
            </div>
          ))
        }}
      >
        Notify!
      </button>
      <Toaster />
    </>,
  )

  fireEvent.click(screen.getByRole('button', { name: /Notify/i }))

  await waitFor(() => screen.getByText(/example/i))

  expect(1).toBe(1)

  expect(screen.queryByText(/example/i)).toBeInTheDocument()

  fireEvent.click(await screen.findByRole('button', { name: /close/i }))

  await waitTime(REMOVE_DELAY)

  expect(screen.queryByText(/example/i)).not.toBeInTheDocument()
})

test('promise toast', async () => {
  const WAIT_DELAY = 1000

  render(
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
            error: 'Error!',
          })
        }}
      >
        Notify!
      </button>
      <Toaster />
    </>,
  )

  await act(() => {
    fireEvent.click(screen.getByRole('button', { name: /Notify/i }))
  })

  await screen.findByText(/loading/i)

  expect(screen.queryByText(/loading/i)).toBeInTheDocument()

  await waitTime(WAIT_DELAY)

  await waitFor(() => {
    expect(screen.queryByText(/success/i)).toBeInTheDocument()
  })
})

test('promise toast error', async () => {
  const WAIT_DELAY = 1000

  const onClick = vi.fn(async () => {
    const sleep = new Promise((_, rej) => {
      setTimeout(rej, WAIT_DELAY)
    })

    await toast.promise(sleep, {
      loading: 'Loading...',
      success: 'Success!',
      error: 'Error!',
    })
  })

  render(
    <>
      <button type="button" onClick={onClick}>
        Notify!
      </button>
      <Toaster />
    </>,
  )

  await act(() => {
    fireEvent.click(screen.getByRole('button', { name: /Notify/i }))
  })

  await screen.findByText(/loading/i)

  expect(screen.queryByText(/loading/i)).toBeInTheDocument()

  await waitTime(WAIT_DELAY)

  await waitFor(() => {
    expect(screen.queryByText(/error/i)).toBeInTheDocument()
  })
})

test('error toast with custom duration', async () => {
  render(
    <>
      <button
        type="button"
        onClick={() => {
          toast.error('An error happened', {
            duration: TOAST_DURATION,
          })
        }}
      >
        Notify!
      </button>
      <Toaster position="bottom-right" />
    </>,
  )

  await act(() => {
    fireEvent.click(screen.getByRole('button', { name: /Notify/i }))
  })

  await screen.findByText(/error/i)

  expect(screen.queryByText(/error/i)).toBeInTheDocument()

  await waitTime(TOAST_DURATION)

  await waitTime(REMOVE_DELAY)

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
})

test('different toasts types with dismiss', async () => {
  render(
    <>
      <Toaster />
    </>,
  )

  await act(() => {
    toast.success('Success!')
  })

  await act(() => {
    toast.error('Error!')
  })

  await act(() => {
    toast('Emoji Icon', {
      icon: '✅',
    })
  })

  await act(() => {
    toast('Custom Icon', {
      icon: <span>ICON</span>,
    })
  })
  let loadingToastId: string
  await act(() => {
    loadingToastId = toast.loading('Loading!')
  })

  expect(screen.queryByText(/error/i)).toBeInTheDocument()
  expect(screen.queryByText(/success/i)).toBeInTheDocument()
  expect(screen.queryByText(/loading/i)).toBeInTheDocument()
  expect(screen.queryByText('✅')).toBeInTheDocument()
  expect(screen.queryByText('ICON')).toBeInTheDocument()

  await waitTime(defaultTimeouts.success)

  await waitTime(REMOVE_DELAY)

  expect(screen.queryByText(/success/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/error/i)).toBeInTheDocument()

  await waitTime(defaultTimeouts.error)

  await waitTime(REMOVE_DELAY)

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

  await act(() => {
    toast.dismiss(loadingToastId)
  })

  await waitTime(REMOVE_DELAY)

  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})

test('custom toaster renderer', async () => {
  render(
    <>
      <Toaster>
        {t => (
          <div className="custom-toast">
            <ToastIcon toast={t} />
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
    </>,
  )

  await act(() => {
    toast.success('Success!')
  })

  expect(screen.queryByText(/success/i)).toHaveClass('custom-toast')

  await act(() => {
    toast(<b>Bold</b>)
  })

  expect(screen.queryByText(/bold/i)).toBeInTheDocument()

  await act(() => {
    toast.custom('Custom')
  })

  expect(screen.queryByText(/custom/i)).not.toHaveClass('custom-toast')
})

test('pause toast', async () => {
  render(
    <>
      <Toaster>
        {t => (
          <div className="custom-toast">
            <ToastIcon toast={t} />
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
    </>,
  )

  await act(() => {
    toast.success('Hover me!', {
      duration: 1000,
    })
  })

  await waitTime(500)

  const toastElement = screen.getByText(/hover me/i)

  expect(toastElement).toBeInTheDocument()

  fireEvent.mouseEnter(toastElement)

  await waitTime(10_000)

  expect(toastElement).toBeInTheDocument()

  fireEvent.mouseLeave(toastElement)

  await waitTime(1000)
  await waitTime(1000)

  expect(toastElement).not.toBeInTheDocument()
})

test('"toast" can be called from useEffect hook', async () => {
  // oxlint-disable-next-line unicorn/consistent-function-scoping
  const MyComponent = () => {
    const [success, setSuccess] = useState(false)
    useEffect(() => {
      toast.success('Success toast')
      setSuccess(true)
    }, [])

    return success ? <div>MyComponent finished</div> : null
  }

  render(
    <>
      <MyComponent />
      <Toaster />
    </>,
  )

  expect(await screen.findByText(/MyComponent finished/i)).toBeInTheDocument()
  expect(await screen.findByText(/Success toast/i)).toBeInTheDocument()
})

describe('multi-Toaster behavior', () => {
  it('renders toasts in correct containers and dismisses them individually', async () => {
    render(
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
    await act(() => {
      toast.success('Default toaster message')
      toast.error('Second toaster message', {
        toasterId: 'second-toaster',
        id: 'second-toast',
      })
      toast.loading('Third toaster message', { toasterId: 'third-toaster' })
    })

    const defaultContainer = document.querySelector('.default-toaster')
    const secondContainer = document.querySelector('.second-toaster')
    const thirdContainer = document.querySelector('.third-toaster')

    // Ensure each toast is present and in the correct container
    expect(defaultContainer).toContainElement(screen.getByText('Default toaster message'))
    expect(secondContainer).toContainElement(screen.getByText('Second toaster message'))
    expect(thirdContainer).toContainElement(screen.getByText('Third toaster message'))

    // Dismiss only the toast in the second toaster
    await act(() => {
      toast.dismiss('second-toast')
    })

    await waitTime(REMOVE_DELAY)

    expect(screen.queryByText('Second toaster message')).not.toBeInTheDocument()
    expect(screen.queryByText('Default toaster message')).toBeInTheDocument()
    expect(screen.queryByText('Third toaster message')).toBeInTheDocument()

    // Dismiss all toasts
    await act(() => {
      toast.dismissAll()
    })

    await waitTime(REMOVE_DELAY)

    expect(screen.queryByText('Default toaster message')).not.toBeInTheDocument()
    expect(screen.queryByText('Second toaster message')).not.toBeInTheDocument()
    expect(screen.queryByText('Third toaster message')).not.toBeInTheDocument()
  })

  it('updates a toast in a specific toaster without affecting others', async () => {
    render(
      <>
        <Toaster containerClassName="default-toaster" />
        <Toaster toasterId="updatable-toaster" containerClassName="updatable-toaster" />
      </>,
    )

    let toastId: string

    // Create a loading toast in the second toaster
    await act(() => {
      toastId = toast.loading('Please wait...', {
        toasterId: 'updatable-toaster',
      })
    })

    const secondContainer = document.querySelector('.updatable-toaster')
    expect(secondContainer).toContainElement(screen.getByText('Please wait...'))

    // Now update that toast to success
    await act(() => {
      // Note that we are not providing a toasterId here
      toast.success('Data saved!', {
        id: toastId,
      })
    })

    // Confirm the updated text
    expect(screen.queryByText('Please wait...')).not.toBeInTheDocument()
    expect(secondContainer).toContainElement(screen.getByText('Data saved!'))
  })

  it('dismisses all toasts from a specific toaster and leaves others intact', async () => {
    render(
      <>
        <Toaster containerClassName="default-toaster" />
        <Toaster toasterId="other-toaster" containerClassName="other-toaster" />
      </>,
    )

    // Create one toast in each toaster
    await act(() => {
      toast.success('Default toaster toast')
      toast.success('Other toaster toast', { toasterId: 'other-toaster' })
    })

    // Ensure both appear
    expect(screen.getByText('Default toaster toast')).toBeInTheDocument()
    expect(screen.getByText('Other toaster toast')).toBeInTheDocument()

    // Dismiss only the second toaster's toasts
    await act(() => {
      toast.dismissAll('other-toaster')
    })
    await waitTime(REMOVE_DELAY)

    // The other toaster's toast should be gone, default remains
    expect(screen.queryByText('Other toaster toast')).not.toBeInTheDocument()
    expect(screen.queryByText('Default toaster toast')).toBeInTheDocument()
  })

  it('dismisses all toasts across all toasters with dismissAll', async () => {
    render(
      <>
        <Toaster containerClassName="default-toaster" />
        <Toaster toasterId="other-toaster" containerClassName="other-toaster" />
      </>,
    )

    // Create one toast in each toaster
    await act(() => {
      toast.success('Default toaster toast')
      toast.error('Other toaster toast', { toasterId: 'other-toaster' })
    })

    // Dismiss every toast in all toasters
    await act(() => {
      toast.dismissAll()
    })
    await waitTime(REMOVE_DELAY)

    // Both should be removed
    expect(screen.queryByText('Default toaster toast')).not.toBeInTheDocument()
    expect(screen.queryByText('Other toaster toast')).not.toBeInTheDocument()
  })

  it('removes toasts immediately when calling toast.remove()', async () => {
    render(
      <>
        <Toaster toasterId="instant-remove-toaster" />
        <Toaster toasterId="another-toaster" />
      </>,
    )

    await act(() => {
      toast.success('Removable toast #1', {
        toasterId: 'instant-remove-toaster',
      })
      toast.error('Removable toast #2', { toasterId: 'another-toaster' })
    })

    expect(screen.queryByText('Removable toast #1')).toBeInTheDocument()
    expect(screen.queryByText('Removable toast #2')).toBeInTheDocument()

    await act(() => {
      toast.removeAll('instant-remove-toaster')
    })

    expect(screen.queryByText('Removable toast #1')).not.toBeInTheDocument()
    expect(screen.queryByText('Removable toast #2')).toBeInTheDocument()
  })
})
