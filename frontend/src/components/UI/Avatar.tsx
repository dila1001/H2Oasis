import { FC } from 'react';
import { User } from '../../services/usersService';
import stringHash from 'string-hash';
import { generateInitials } from '../../utils/avatarUtils';

type AvatarProps = {
	user: User;
	size: 'xl' | 'xs';
};

const Avatar: FC<AvatarProps> = ({ user, size }) => {
	const bgColour = ['primary', 'secondary', 'base-300', 'warning', 'neutral'];

	const avatarBg = () => {
		const hash = stringHash(user.id);
		const colorIndex = Math.abs(hash) % bgColour.length;
		return bgColour[colorIndex];
	};

	return (
		<div className='avatar placeholder'>
			<div
				className={`bg-${avatarBg()} text-neutral-content rounded-full w-${
					size === 'xl' ? '16' : '8'
				}`}
			>
				<span className={`text-${size}`}>{generateInitials(user)}</span>
			</div>
		</div>
	);
};

export default Avatar;
