export interface products {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    category: ("pizza" | "dessert" | "drink" | "resto") [];
    isRecommended: boolean;
}

export const products = [
    {
        id: 1,
        name:"Meat Lovers",
        price:89500,
        image:"/images/meatlovers.webp",
        description: "Size 30cm.Meat Ball,Smoked Beff,Sosis,Jamur Bottom,Paprika,Keju Mozzarella,B.Gank Bolognaise Sauce",
        category: "pizza",
        isRecommended: true
    },
    {
        id: 2,
        name:"Pepperoni Medium Boss Gank Pizza",
        price:67500,
        image:"/images/Pepperoni Medium Boss Gank Pizza.webp",
        description: "Size 22cm",
        category: "pizza",
        isRecommended: true
    },
    {
        id: 3,
        name:"Pepperoni Boss Gank Pizza",
        price:84500,
        image:"/images/Pepperoni Boss Gank Pizza.webp",
        description: "Size 30cm, Saus Tomato,Fresh Tomato,Pepperoni,Keju Mozzarella",
        category: "pizza",
        isRecommended: true
    },
    {
        id: 4,
        name:"Zuppa Soup",
        price:16000,
        image:"/images/Zuppa Soup.webp",
        description: "Cream Kental,Wortel,Jagung, Kacang Polong, Ayam Cincang, Topping Puff Pastry",
        category: "dessert",
        isRecommended: true
    },
    {
        id: 5,
        name:"Meat Lovers Medium",
        price:68500,
        image:"/images/Meat Lovers Medium.webp",
        description: "Size 22cm",
        category: "pizza",
        isRecommended: true
    },
    {
        id: 6,
        name:"Double Cheese",
        price:83500,
        image:"/images/doublecheese.webp",
        description: "Size 30cm.Smoked Beff,Sosis,Keju Chedar,Keju Mozzarella,B.Gank Tomato Sauce",
        category: "pizza",
        isRecommended: false
    },
    {
        id: 7,
        name:"Supreme Xtra Topping Mozza+ 1 Botol Kunyit Asam",
        price:119500,
        image:"/images/Supreme Xtra Topping Mozza+ 1 Botol Kunyit Asam.webp",
        description: "Pizza 30cm + 1 botol kunyit asam 500ml",
        category: ["resto"],
        isRecommended: false
    },
    {
        id: 8,
        name:"Kunyit Asam",
        price:10500,
        image:"/images/Kunyit Asam.webp",
        description: "1 botol kunyit asam gula merah 500ml",
        category: ["resto", "drink"],
        isRecommended: false
    },
    {
        id: 9,
        name:"Macotel+pumpkin Baked",
        price:90000,
        image:"/images/Macotel+pumpkin Baked.webp",
        description: "3 Cup Macaroni Schotel + 3 Cup Pumpkin Baked Cheese",
        category: ["resto", "dessert"],
        isRecommended: false
    },
    {
        id: 10,
        name:"Box Of Bliss Boss Gank Pizza",
        price:619000,
        image:"/images/Box Of Bliss Boss Gank Pizza.webp",
        description: "Pizza large : meat lovers, beef blackpepper, mix truffle alfredo, beef burger, chicken teriyaki, sweet choco , macotel 3 cup + pumpkin cheese 3 cup. Free 3 botol kunyit asam+ 3 botol susu kedelai 500ml",
        category: ["resto", "dessert"],
        isRecommended: false
    },
]
