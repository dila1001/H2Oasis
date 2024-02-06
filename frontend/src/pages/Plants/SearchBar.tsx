import { useState } from 'react';

const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState('');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className='my-2'>
			<input
				type='text'
        placeholder='Search'
        onChange={handleChange}
				className='input input-bordered input-warning w-full'
			/>
		</div>
	);
};

export default SearchBar;
