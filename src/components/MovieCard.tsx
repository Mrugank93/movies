import Image from "next/image";
import Link from "next/link";

const MovieCard = ({ movie }: MovieCardProps) => (
    <div
        key={movie._id}
        className="bg-[#092C39] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
    >
        <MovieCard.Image image={movie.image} title={movie.title} id={movie._id} />
        <MovieCard.Content title={movie.title} year={movie.year} />
    </div>
);


MovieCard.Image = ({ image, title, id }: MovieCardImageProps) => (
    <Link
        href={`/movie/${id}`}
    >
        <Image
            src={image || "/padmavati.jpg"}
            alt={title}
            className="relative w-full h-40 sm:h-60 hover:cursor-pointer rounded-t-lg"
            width={300}
            height={400}
        />
    </Link>
);

MovieCard.Content = ({ title, year }: MovieCardContentProps) => (
    <div className="p-4">
        <h2 className="text-white text-lg sm:text-xl font-semibold">{title}</h2>
        <p className="text-gray-400">{year}</p>
    </div>
);

// Set displayName for each subcomponent
MovieCard.displayName = "MovieCard";
MovieCard.Image.displayName = "MovieCard.Image";
MovieCard.Content.displayName = "MovieCard.Content";

export default MovieCard;

interface MovieCardProps {
    movie: {
        _id: string;
        image: string;
        title: string;
        year: string;
    };
}

interface MovieCardImageProps {
    image: string;
    title: string;
    id: string;
}

interface MovieCardContentProps {
    title: string;
    year: string;
}