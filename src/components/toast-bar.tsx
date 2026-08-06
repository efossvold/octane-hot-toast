import type { CSSProperties } from 'react'

import { keyframes, css } from 'goober'
import { memo } from 'octane'

import type { Toast, ToastPosition, Renderable, PropsWithChildren } from '../core/types'

import { resolveValue } from '../core/types'
import { prefersReducedMotion } from '../core/utils'
import { ToastIcon } from './toast-icon'

const enterAnimation = (factor: number) => `
0% {transform: translate3d(0,${factor * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`

const exitAnimation = (factor: number) => `
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${factor * -150}%,-1px) scale(.6); opacity:0;}
`

const fadeInAnimation = `0%{opacity:0;} 100%{opacity:1;}`
const fadeOutAnimation = `0%{opacity:1;} 100%{opacity:0;}`

const toastBarBaseStyle = css`
  :where(&) {
    display: flex;
    align-items: center;
    background: #fff;
    color: #363636;
    line-height: 1.3;
    will-change: transform;
    box-shadow:
      0 3px 10px rgba(0, 0, 0, 0.1),
      0 3px 3px rgba(0, 0, 0, 0.05);
    max-width: 350px;
    pointer-events: auto;
    padding: 8px 10px;
    border-radius: 8px;
  }
`

// const ToastBarBase = (p: PropsWithChildren) =>
//   createElement('div', {
//     // Use :where() for zero specificity - allows Tailwind to override easily
//     style: p.style ?? '',
//     className: `${toastBarBaseStyle} ${p.className}`,
//     children: p.children,
//   })

const ToastBarBase = (p: PropsWithChildren) => (
  // Use :where() for zero specificity - allows Tailwind to override easily
  <div style={p.style ?? ''} className={`${toastBarBaseStyle} ${p.className}`}>
    {p.children}
  </div>
)

// const Message = (p: PropsWithChildren & Toast['ariaProps']) =>
//   createElement('div', {
//     className: css`
//       display: flex;
//       justify-content: center;
//       margin: 4px 10px;
//       color: inherit;
//       flex: 1 1 auto;
//       white-space: pre-line;
//     `,
//     children: p.children,
//   })

const Message = (p: PropsWithChildren) => (
  <div
    className={css`
      display: flex;
      justify-content: center;
      margin: 4px 10px;
      color: inherit;
      flex: 1 1 auto;
      white-space: pre-line;
    `}
  >
    {p.children}
  </div>
)

interface ToastBarProps {
  toast: Toast
  position?: ToastPosition
  style?: CSSProperties
  children?: (components: { icon: Renderable; message: Renderable }) => Renderable
}

const getAnimationStyle = (position: ToastPosition, visible: boolean): CSSProperties => {
  const top = position.includes('top')
  const factor = top ? 1 : -1

  const [enter, exit] = prefersReducedMotion()
    ? [fadeInAnimation, fadeOutAnimation]
    : [enterAnimation(factor), exitAnimation(factor)]

  return {
    animation: visible
      ? `${keyframes(enter)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
      : `${keyframes(exit)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`,
  }
}

// export const ToastBar = memo<ToastBarProps>(({ toast, position, style, children }) => {
//   const animationStyle: CSSProperties = toast.height
//     ? getAnimationStyle(toast.position ?? position ?? 'top-center', toast.visible)
//     : { opacity: 0 }

//   const icon = createElement(ToastIcon, { key: '1', toast })
//   const message = createElement(Message, {
//     ...toast.ariaProps,
//     key: '2',
//     children: resolveValue(toast.message, toast),
//   })

//   return createElement(ToastBarBase, {
//     className: toast.className ?? '',
//     style: {
//       ...animationStyle,
//       ...style,
//       ...toast.style,
//     },
//     children:
//       typeof children === 'function'
//         ? children({
//             icon,
//             message,
//           })
//         : [icon, message],
//   })
// })

export const ToastBar = memo<ToastBarProps>(({ toast, position, style, children }) => {
  const animationStyle: CSSProperties = toast.height
    ? getAnimationStyle(toast.position ?? position ?? 'top-center', toast.visible)
    : { opacity: 0 }

  const icon = <ToastIcon toast={toast} />
  const message = <Message {...toast.ariaProps}>{resolveValue(toast.message, toast)}</Message>

  return (
    <ToastBarBase
      className={toast.className ?? ''}
      style={{
        ...animationStyle,
        ...style,
        ...toast.style,
      }}
    >
      {typeof children === 'function' ? (
        children({
          icon,
          message,
        })
      ) : (
        <>
          {icon}
          {message}
        </>
      )}
    </ToastBarBase>
  )
})
