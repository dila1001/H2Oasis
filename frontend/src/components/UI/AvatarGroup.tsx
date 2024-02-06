import { FC } from 'react';
import { User } from '../../services/usersService';
import Avatar from './Avatar';

type AvatarGroupProps = {
	users: User[];
};

const AvatarGroup: FC<AvatarGroupProps> = ({ users }) => {
	return (
		<div className='avatar-group -space-x-5 rtl:space-x-reverse'>
			{users.length < 4 ? (
				users.map((user) => <Avatar key={user.id} user={user} size='xs' />)
			) : (
				<>
					{[...users.slice(0, 3)].map((user) => (
						<Avatar key={user.id} user={user} size='xs' />
					))}
					<Avatar remainingUsers={users.length - 3} size='xs' />
				</>
			)}
		</div>
	);
};

export default AvatarGroup;
