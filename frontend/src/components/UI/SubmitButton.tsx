import React, { FC } from 'react';

type SubmitButtonProps = {
	iconName: React.ComponentType;
	formState?: boolean;
	buttonType?: 'submit' | 'button';
	onClick?: () => void;
};

const SubmitButton: FC<SubmitButtonProps> = (props: {
	iconName: React.ComponentType<{ className?: string }>;
	formState?: boolean;
	buttonType?: 'submit' | 'button';
	onClick?: () => void;
}) => {
	return (
		<button
			type={props.buttonType}
			className='bg-secondary rounded-full p-4 flex justify-center w-full shadow-md'
			disabled={props.formState}
			onClick={props.onClick}
		>
			<props.iconName className='text-white text-2xl' />
		</button>
	);
};

export default SubmitButton;
