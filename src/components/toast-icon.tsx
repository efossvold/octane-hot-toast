import { keyframes, css } from 'goober'

import type { PropsWithChildren, Toast } from '../core/types'
import type { CheckmarkTheme } from './checkmark'
import type { ErrorTheme } from './error'
import type { LoaderTheme } from './loader'

import { CheckmarkIcon } from './checkmark'
import { ErrorIcon } from './error'
import { LoaderIcon } from './loader'

// const StatusWrapper = ({ children }: PropsWithChildren) =>
//   createElement('div', {
//     className: css`
//       position: absolute;
//     `,
//     children,
//   })

const StatusWrapper = (p: PropsWithChildren) => (
  <div
    className={css`
      position: absolute;
    `}
  >
    {p.children}
  </div>
)

// const IndicatorWrapper = ({ children }: PropsWithChildren) =>
//   createElement('div', {
//     className: css`
//       position: relative;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       min-width: 20px;
//       min-height: 20px;
//     `,
//     children,
//   })

const IndicatorWrapper = (p: PropsWithChildren) => (
  <div
    className={css`
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 20px;
      min-height: 20px;
    `}
  >
    {p.children}
  </div>
)

const enter = keyframes`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`

// const AnimatedIconWrapper = ({ children }: PropsWithChildren) =>
//   createElement('div', {
//     className: css`,
//       position: relative;
//       transform: scale(0.6);
//       opacity: 0.4;
//       min-width: 20px;
//       animation: ${enter} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
//     `,
//     children,
//   })

const AnimatedIconWrapper = (p: PropsWithChildren) => (
  <div
    className={css`
      position: relative;
      transform: scale(0.6);
      opacity: 0.4;
      min-width: 20px;
      animation: ${enter} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `}
  >
    {p.children}
  </div>
)

export type IconThemes = Partial<{
  success: CheckmarkTheme
  error: ErrorTheme
  loading: LoaderTheme
}>

// export const ToastIcon = ({ toast }: { toast: Toast }) => {
//   const { icon, type, iconTheme } = toast
//   if (icon !== undefined) {
//     if (typeof icon === 'string') {
//       return createElement(AnimatedIconWrapper, { children: icon })
//     } else {
//       return icon
//     }
//   }

//   if (type === 'blank') {
//     return null
//   }

//   return createElement(IndicatorWrapper, {
//     children:
//       type !== 'loading'
//         ? [
//             createElement(LoaderIcon, { key: '1', ...iconTheme }),
//             createElement(StatusWrapper, {
//               key: '2',
//               children:
//                 type === 'error'
//                   ? createElement(ErrorIcon, iconTheme)
//                   : createElement(CheckmarkIcon, iconTheme),
//             }),
//           ]
//         : null,
//   })
// }

export const ToastIcon = ({ toast }: { toast: Toast }) => {
  const { icon, type, iconTheme } = toast
  if (icon !== undefined) {
    if (typeof icon === 'string') {
      return <AnimatedIconWrapper>{icon}</AnimatedIconWrapper>
    } else {
      return icon
    }
  }

  if (type === 'blank') {
    return null
  }

  return (
    <IndicatorWrapper>
      <LoaderIcon {...iconTheme} />
      {type !== 'loading' && (
        <StatusWrapper>
          {type === 'error' ? <ErrorIcon {...iconTheme} /> : <CheckmarkIcon {...iconTheme} />}
        </StatusWrapper>
      )}
    </IndicatorWrapper>
  )
}
