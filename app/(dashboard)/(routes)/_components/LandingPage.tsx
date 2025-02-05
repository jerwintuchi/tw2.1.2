


import { Button } from "@/components/ui/button";
import FeatureSection from "./FeatureSection";

export default async function Home() {
    return (
        <>
            <main className="flex-1 flex flex-col gap-12 px-4 py-12  dark:bg-background text-foreground dark:text-white">
                {/* Call to Action Section */}
                <section className="text-center py-12">
                    <h2 className="text-3xl font-bold mb-6">Welcome and Get Started</h2>
                    <p className="text-lg mb-8">
                        This web app features multiple apps based on the requirements.
                    </p>
                    <Button className="bg-green-500 text-white text-lg py-3 px-6 rounded-full hover:bg-green-700 transition duration-300">
                        <a href="sign-up">Get Started Now</a>
                    </Button>
                </section>
                {/* Feature Section */}
                <FeatureSection />
            </main>
        </>
    );
}
