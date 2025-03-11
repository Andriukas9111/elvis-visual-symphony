
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormActions from "../ui/FormActions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  order: number;
}

const TechnicalSkillsForm: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: fetchedSkills, isLoading } = useQuery({
    queryKey: ["technicalSkills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technical_skills")
        .select("*")
        .order("order");
        
      if (error) throw error;
      return data || [];
    }
  });
  
  // Update skills when data is fetched
  useEffect(() => {
    if (fetchedSkills) {
      setSkills(fetchedSkills);
    }
  }, [fetchedSkills]);

  const handleSkillChange = (id: string, field: keyof Skill, value: string | number) => {
    setSkills(prevSkills => 
      prevSkills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
    setIsDirty(true);
  };

  const handleSaveChanges = async () => {
    if (!isDirty) return;
    
    setIsSubmitting(true);
    try {
      // Update skills in database
      for (const skill of skills) {
        const { error } = await supabase
          .from("technical_skills")
          .update({
            name: skill.name,
            proficiency: skill.proficiency
          })
          .eq("id", skill.id);
          
        if (error) throw error;
      }
      
      toast.success("Technical skills updated successfully");
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving technical skills:", error);
      toast.error("Failed to update technical skills");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDiscardChanges = () => {
    // Reset to original data
    if (fetchedSkills) {
      setSkills(fetchedSkills);
    }
    setIsDirty(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-8 bg-elvis-medium animate-pulse rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-24 bg-elvis-medium animate-pulse rounded" />
              <div className="h-24 bg-elvis-medium animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your technical skills that showcase your expertise.
            </p>
          </div>

          <div className="space-y-4">
            {skills && skills.length > 0 ? (
              skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-4 p-3 border border-border rounded-md">
                  <div className="flex-1">
                    <Label htmlFor={`skill-${index}`}>Skill Name</Label>
                    <Input 
                      id={`skill-${index}`}
                      value={skill.name} 
                      onChange={(e) => handleSkillChange(skill.id, 'name', e.target.value)}
                      className="mt-1" 
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`proficiency-${index}`}>Proficiency (%)</Label>
                    <Input 
                      id={`proficiency-${index}`}
                      type="number" 
                      min={0} 
                      max={100} 
                      value={skill.proficiency}
                      onChange={(e) => handleSkillChange(skill.id, 'proficiency', parseInt(e.target.value))} 
                      className="mt-1" 
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 border border-dashed border-elvis-medium rounded-md">
                <p className="text-muted-foreground">No technical skills added yet</p>
              </div>
            )}
          </div>
          
          <FormActions 
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onSave={handleSaveChanges}
            onDiscard={handleDiscardChanges}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSkillsForm;
