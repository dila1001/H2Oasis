import { FC } from 'react';
import { User } from '../../services/usersService';
import stringHash from 'string-hash';
import { generateInitials } from '../../utils/avatarUtils';

type AvatarProps = {
	user?: User;
	size: 'xl' | 'xs';
	remainingUsers?: number;
};

const Avatar: FC<AvatarProps> = ({ user, size, remainingUsers }) => {
	const bgColour = [
		'bg-primary',
		'bg-secondary',
		'bg-accent',
		'bg-[#D19A7C]',
		'bg-neutral',
	];

	const avatarBg = () => {
		if (remainingUsers) {
			return 'bg-[#43491D]';
		}

		const hash = stringHash(user!.id);
		const colorIndex = Math.abs(hash) % bgColour.length;
		return bgColour[colorIndex];
	};

	return (
		<div className='avatar placeholder flex items-center'>
			<div
				className={`${avatarBg()} marker:text-neutral-content rounded-full ${
					size === 'xl' ? 'w-16 h-16' : 'w-8 h-8'
				}`}
			>
				<span
					className={`text-${size} ${
						avatarBg() === 'bg-accent' ? 'text-base-100' : 'text-[#ddddd4]'
					}`}
				>
					{remainingUsers ? `+${remainingUsers}` : generateInitials(user!)}
				</span>
			</div>
		</div>
	);
};

export default Avatar;
