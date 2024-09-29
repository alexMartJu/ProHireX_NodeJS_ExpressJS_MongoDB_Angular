export class Filters {
    price_min?: number;
    price_max?: number;
    category?: string;
    name?: string;
    
    constructor(
        price_min?: number,
        price_max?: number,
        category?: string,
        name?: string,
    ) 
    {
        this.price_min = price_min;
        this.price_max = price_max;
        this.category = category;
        this.name = name;
    }

    public length(): number {
        let count: number = 0;
        if (this.price_min) count++;
        if (this.price_max) count++;
        if (this.category) count++;
        if (this.name) count++;
        return count;
    }
}
