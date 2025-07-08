import AddVideoForm from "@/components/organisms/video/video-add-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddVideoPage() {
  return (
    <div className="container py-10">
      <Card className="w-full max-w-[90vw] min-h-screen mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <div className="w-full flex items-center justify-between">
            <CardTitle className="text-2xl text-start">Add Video</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <AddVideoForm />
        </CardContent>
      </Card>
    </div>
  );
}
