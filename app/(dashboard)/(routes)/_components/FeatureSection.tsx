import { FaList, FaCloudUploadAlt, FaUtensils, FaSearch, FaMarkdown } from 'react-icons/fa';

const FeatureSection = () => {
    return (
        <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Multiple Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* To-do List Feature */}
                <div className="p-6 dark:bg-green-900 rounded-lg shadow-lg text-white bg-green-600">
                    <div className="flex justify-center mb-4">
                        <FaList className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Personalized To-Do List</h3>
                    <p>
                        Create, update, and delete your tasks easily. Your to-do list is saved
                        even after restarting the app, and you can only see your own tasks.
                    </p>
                </div>

                {/* Google Drive Lite Feature */}
                <div className="p-6 dark:bg-green-900 rounded-lg shadow-lg text-white bg-green-600">
                    <div className="flex justify-center mb-4">
                        <FaCloudUploadAlt className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Google Drive "Lite"</h3>
                    <p>
                        Upload, manage, and organize your photos. You can search by photo name and
                        sort by upload date to find your images faster.
                    </p>
                </div>

                {/* Food Review App Feature */}
                <div className="p-6 dark:bg-green-900 rounded-lg shadow-lg text-white bg-green-600">
                    <div className="flex justify-center mb-4">
                        <FaUtensils className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Food Reviews</h3>
                    <p>
                        Share food photos and reviews! Add, update, and delete your food photos and
                        reviews. Sort by photo name or upload date.
                    </p>
                </div>

                {/* Pokemon Review App Feature */}
                <div className="p-6 dark:bg-green-900 rounded-lg shadow-lg text-white bg-green-600">
                    <div className="flex justify-center mb-4">
                        <FaSearch className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Pokemon Reviews</h3>
                    <p>
                        Explore and review Pokemon! Search by Pokemon name, add reviews, and sort
                        reviews by name or upload date.
                    </p>
                </div>

                {/* Markdown Notes App Feature */}
                <div className="p-6 dark:bg-green-900 rounded-lg shadow-lg text-white bg-green-600">
                    <div className="flex justify-center mb-4">
                        <FaMarkdown className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Markdown Notes</h3>
                    <p>
                        Take notes in Markdown format! Create, update, and delete notes with the ability
                        to view them in both raw and preview modes.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
