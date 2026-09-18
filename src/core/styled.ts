// oxlint-disable typescript/no-empty-object-type
import type { Theme, DefaultTheme } from 'goober'
import type { Octane, JSX } from 'octane/jsx-runtime'
import type { CSSProperties } from 'react'

import { styled as gooberStyled } from 'goober'

interface StyledFunction {
  // used when creating a styled component from a native HTML element
  <T extends keyof JSX.IntrinsicElements, P extends object = {}>(
    tag: T,
    forwardRef?: ForwardRefFunction,
  ): Tagged<
    React.JSX.LibraryManagedAttributes<T, Octane.JSX.IntrinsicElements[T]> & P & Theme<DefaultTheme>
  >

  // used to extend other styled components. Inherits props from the extended component
  <PP extends object = {}, P extends object = {}>(
    tag: StyledVNode<PP>,
    forwardRef?: ForwardRefFunction,
  ): Tagged<PP & P & Theme<DefaultTheme>>

  // used when creating a component from a string (html native) but using a non HTML standard
  // component, such as when you want to style web components
  <P extends object = {}>(tag: string): Tagged<P & Partial<Octane.JSX.ElementChildrenAttribute>>

  // used to create a styled component from a JSX element (both functional and class-based)
  <P extends object = {}>(
    // tag: Octane.JSX.Element | React.JSX.ElementClass,
    tag: Octane.JSX.Element,
    forwardRef?: ForwardRefFunction,
  ): Tagged<P>
}

type StyledVNode<T> = ((props: T, ...args: any[]) => any) & {
  defaultProps?: T
  displayName?: string
}

type StylesGenerator<P extends object = {}> = (props: P) => CSSAttribute | string

type ForwardRefFunction = {
  (props: any, ref: any): any
}

type Tagged<P extends object = {}> = <PP extends object = { as?: any }>(
  tag:
    | CSSAttribute
    | (CSSAttribute | StylesGenerator<P & PP>)[]
    | TemplateStringsArray
    | string
    | StylesGenerator<P & PP>,
  ...props: Array<
    string | number | ((props: P & PP) => CSSAttribute | string | number | false | undefined)
  >
) => StyledVNode<Omit<P & PP, keyof Theme<DefaultTheme>>>

interface CSSAttribute extends CSSProperties {
  [key: string]: CSSAttribute | string | number | undefined | null
}

export const styled = gooberStyled as unknown as StyledFunction
