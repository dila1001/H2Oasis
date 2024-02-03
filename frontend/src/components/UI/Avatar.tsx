import { FC } from 'react';
import { User } from '../../services/usersService';
import stringHash from 'string-hash';
import { generateInitials } from '../../utils/avatarUtils';

type AvatarProps = {
	user: User;
	size: 'xl' | 'xs';
};

const Avatar: FC<AvatarProps> = ({ user, size }) => {
	const bgColour = [
		'bg-primary',
		'bg-secondary',
		'bg-base-300',
		'bg-warning',
		'bg-neutral',
	];

	const avatarBg = () => {
		const hash = stringHash(user.id);
		const colorIndex = Math.abs(hash) % bgColour.length;
		return bgColour[colorIndex];
	};

	return (
		<div className='avatar placeholder'>
			<div
				className={`${avatarBg()} text-neutral-content rounded-full ${
					size === 'xl' ? 'w-16' : 'w-8'
				}`}
			>
				<span className={`text-${size}`}>{generateInitials(user)}</span>
			</div>
		</div>
	);
};

export default Avatar;
