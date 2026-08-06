import { keyframes, css } from 'goober'

import type { PropsWithChildren } from '../core/types'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export interface LoaderTheme {
  primary?: string
  secondary?: string
}

// export const LoaderIcon = (p: PropsWithChildren<LoaderTheme>) =>
//   createElement('div', {
//     className: css`
//       width: 12px;
//       height: 12px;
//       box-sizing: border-box;
//       border: 2px solid;
//       border-radius: 100%;
//       border-color: ${p.secondary ?? '#e0e0e0'};
//       border-right-color: ${p.primary ?? '#616161'};
//       animation: ${rotate} 1s linear infinite;
//     `,
//   })

export const LoaderIcon = (p: PropsWithChildren<LoaderTheme>) => (
  <div
    className={css`
      width: 12px;
      height: 12px;
      box-sizing: border-box;
      border: 2px solid;
      border-radius: 100%;
      border-color: ${p.secondary ?? '#e0e0e0'};
      border-right-color: ${p.primary ?? '#616161'};
      animation: ${rotate} 1s linear infinite;
    `}
  />
)
