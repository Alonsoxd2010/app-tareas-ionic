export interface Task {
    id?: string;
    uid: string;  // 👈 Esta propiedad es necesaria
    title: string;
    description?: string;
    items: Item[];
    createdAt?: Date;
}

export interface Item {
    name: string;
    completed: boolean;
}