import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { ButtonProps, Options } from '@/components/elements/button/types';

const BaseButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, shape, size, variant, className, ...rest }, ref) => {
        return (
            <button
                ref={ref}
                className={classNames(
                    'brutal-btn',
                    {
                        'brutal-btn-primary': !variant || variant === Options.Variant.Primary,
                        'brutal-btn-secondary': variant === Options.Variant.Secondary,
                        'brutal-btn-danger': variant === Options.Variant.Danger,
                        'px-3 py-1.5 text-xs': size === Options.Size.Small,
                        'px-5 py-2.5 text-sm': !size || size === Options.Size.Default,
                        'px-7 py-3.5 text-base': size === Options.Size.Large,
                        'w-10 h-10 p-0': shape === Options.Shape.IconSquare,
                    },
                    className
                )}
                {...rest}
            >
                {children}
            </button>
        );
    }
);

const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <BaseButton ref={ref} variant={Options.Variant.Primary} {...props} />
));

const TextButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <BaseButton ref={ref} variant={Options.Variant.Secondary} {...props} />
));

const DangerButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
    <BaseButton ref={ref} variant={Options.Variant.Danger} {...props} />
));

const _Button = Object.assign(BaseButton, {
    Sizes: Options.Size,
    Shapes: Options.Shape,
    Variants: Options.Variant,
    Primary: PrimaryButton,
    Text: TextButton,
    Danger: DangerButton,
});

export default _Button;
