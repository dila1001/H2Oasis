import { FC } from 'react';
import { User } from '../../services/usersService';
import Avatar from './Avatar';

type AvatarGroupProps = {
	users: User[];
};

const AvatarGroup: FC<AvatarGroupProps> = ({ users }) => {
	return (
		<div className='avatar-group -space-x-5 rtl:space-x-reverse'>
			{users.map((user) => (
				<Avatar user={user} size='xs' />
			))}
		</div>
	);
};

export default AvatarGroup;
