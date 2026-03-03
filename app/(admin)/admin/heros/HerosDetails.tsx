"use client";

import { useState } from "react";
// import { upsertHero, deleteHero } from "@/actions/heroActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2, ImageIcon, Globe, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteHero, upsertHero } from "@/actions/herosActions";

const Heros = ({ heros = [] }: { heros: any[] }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const result = await upsertHero(formData);
      if (result.success) {
        setPreview(null);
        form.reset();
      }
    } catch (error) {
      alert("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imagePath: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
        await deleteHero(id, imagePath);
    } catch (error) {
        alert("Failed to delete.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-slate-800">Hero Slider Management</h1>
          <p className="text-muted-foreground text-sm">Upload, active/deactivate and delete slider images.</p>
        </div>
        <Badge variant="outline" className="h-6">
          Total: {heros?.length || 0}
        </Badge>
      </div>

      {/* --- UPLOAD FORM --- */}
      <Card className="border-2 border-dashed bg-slate-50/50">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Slider Title</Label>
              <Input id="title" name="title" placeholder="Summer Collection 2024" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Redirect URL (Link)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input id="url" name="url" className="pl-9" placeholder="https://yourshop.com/sale" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Slider Image</Label>
              <Input 
                name="image" 
                type="file" 
                accept="image/*" 
                required={!preview}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox id="isActive" name="isActive" value="true" defaultChecked />
              <Label htmlFor="isActive" className="font-medium cursor-pointer">Set as Active</Label>
            </div>
          </div>

          {preview && (
            <div className="relative rounded-lg overflow-hidden border-2 border-white shadow-md h-52 w-full bg-slate-200">
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold">Preview Mode</span>
              </div>
            </div>
          )}

          <Button disabled={loading} className="w-full h-11">
            {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
            {loading ? "Uploading to Server..." : "Save Slider Content"}
          </Button>
        </form>
      </Card>

      {/* --- SLIDER LIST & EMPTY STATE --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-700">
          <ImageIcon className="h-5 w-5" /> Current Active Sliders
        </h2>
        
        {/* Conditional Rendering for Empty State */}
        {heros && heros.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {heros.map((hero) => (
              <Card key={hero.id} className="group overflow-hidden border shadow-sm transition-all hover:shadow-md">
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={hero.image} alt={hero.title} className="h-full w-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className={hero.isActive ? "bg-green-600" : "bg-slate-500"}>
                      {hero.isActive ? "Live" : "Hidden"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex justify-between items-start bg-white">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 truncate max-w-[200px]">
                        {hero.title || "Untitled Slider"}
                    </h3>
                    <p className="text-xs text-blue-600 truncate max-w-[220px]">
                        {hero.url || "No redirection link"}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(hero.id, hero.image)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-2xl bg-slate-50 text-center">
            <div className="bg-slate-200 p-4 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">No sliders found</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Your homepage currently doesn't have any hero images. Use the form above to upload your first slider.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heros;