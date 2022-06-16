type Place = {
	id: number;
	name: string;
	category?: Category;
	latitude: number;
	longitude: number;
	description?: string | undefined;
	date?: string | undefined;
};

enum Category {
	NONE = 'none',
	EAT = 'eat',
	DRINK = 'drink',
	COFFEE = 'coffee',
	SIGHtSEE = 'sightsee',
	HOTEL = 'hotel',
}
