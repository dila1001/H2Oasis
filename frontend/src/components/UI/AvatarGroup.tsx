import { FC } from 'react';
import { User } from '../../services/usersService';
import Avatar from './Avatar';

type AvatarGroupProps = {
	users: User[];
	styles?: string;
};

const AvatarGroup: FC<AvatarGroupProps> = ({ users, styles }) => {
	return (
		<div className={`avatar-group -space-x-5 rtl:space-x-reverse ${styles}`}>
			{users.map((user) => (
				<Avatar key={user.id} user={user} size='xs' />
			))}
		</div>
	);
};

export default AvatarGroup;
