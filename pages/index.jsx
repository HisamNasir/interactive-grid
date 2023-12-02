
import DisplayImageGallery from "@/components/DisplayImageGallery";
import ImageUpload from "@/components/ImageUpload";
import Head from "next/head";

export default function Home() {

  return (
    <>
      {/* Set document head metadata */}
      <Head>
        <title>Boilerplate</title>
      </Head>

      <main>
        <div className="min-h-screen p-8 ">
        <h1>Next.js Firebase Image Upload</h1>
        <ImageUpload/>
        <DisplayImageGallery/>
        </div>
      </main>
    </>
  );
}
