/** @jsxImportSource octane */
// oxlint-disable no-nested-ternary
import type { CSSProperties } from 'react'

import { css, setup } from 'goober'
import { useCallback, createElement } from 'octane'

import type { ToasterProps, ToastPosition, ToastWrapperProps } from '../core/types'

import { resolveValue } from '../core/types'
import { useToaster } from '../core/use-toaster'
import { prefersReducedMotion } from '../core/utils'
import { ToastBar } from './toast-bar'

setup(createElement)

const ToastWrapper = ({ id, className, style, onHeightUpdate, children }: ToastWrapperProps) => {
  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        const updateHeight = () => {
          const { height } = el.getBoundingClientRect()
          onHeightUpdate(id, height)
        }
        updateHeight()
        new MutationObserver(updateHeight).observe(el, {
          subtree: true,
          childList: true,
          characterData: true,
        })
      }
    },
    [id, onHeightUpdate],
  )

  return (
    <div ref={ref} className={className ?? ''} style={style ?? ''}>
      {children}
    </div>
  )
}

const getPositionStyle = (position: ToastPosition, offset: number): CSSProperties => {
  const top = position.includes('top')
  const verticalStyle: CSSProperties = top ? { top: 0 } : { bottom: 0 }
  const horizontalStyle: CSSProperties = position.includes('center')
    ? {
        justifyContent: 'center',
      }
    : position.includes('right')
      ? {
          justifyContent: 'flex-end',
        }
      : {}
  return {
    left: 0,
    right: 0,
    display: 'flex',
    position: 'absolute',
    transition: prefersReducedMotion() ? undefined : `all 230ms cubic-bezier(.21,1.02,.73,1)`,
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  }
}

const activeClass = css`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`

const DEFAULT_OFFSET = 16

export const Toaster = ({
  reverseOrder,
  position = 'top-center',
  toastOptions,
  gutter,
  children,
  toasterId,
  containerStyle,
  containerClassName,
}: ToasterProps) => {
  const { toasts, handlers } = useToaster(toastOptions, toasterId)

  return (
    <div
      data-rht-toaster={toasterId ?? ''}
      style={{
        position: 'fixed',
        zIndex: 9999,
        top: DEFAULT_OFFSET,
        left: DEFAULT_OFFSET,
        right: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET,
        pointerEvents: 'none',
        ...containerStyle,
      }}
      className={containerClassName ?? ''}
      onMouseEnter={handlers.startPause}
      onMouseLeave={handlers.endPause}
    >
      {toasts.map(t => {
        const toastPosition = t.position ?? position
        const offset = handlers.calculateOffset(t, {
          reverseOrder: reverseOrder ?? false,
          gutter: gutter ?? 4,
          defaultPosition: position,
        })
        const positionStyle = getPositionStyle(toastPosition, offset)

        return (
          <ToastWrapper
            id={t.id}
            key={t.id}
            onHeightUpdate={handlers.updateHeight}
            className={t.visible ? activeClass : ''}
            style={positionStyle}
          >
            {t.type === 'custom' ? (
              resolveValue(t.message, t)
            ) : children ? (
              children(t)
            ) : (
              <ToastBar toast={t} position={toastPosition} />
            )}
          </ToastWrapper>
        )
      })}
    </div>
  )
}
