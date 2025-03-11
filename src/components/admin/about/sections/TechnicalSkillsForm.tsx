
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormActions from "../ui/FormActions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const TechnicalSkillsForm: React.FC = () => {
  const { data: skills, isLoading } = useQuery({
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

          {/* This is a placeholder component - implement the real form */}
          <div className="space-y-4">
            {skills && skills.length > 0 ? (
              skills.map((skill: any, index: number) => (
                <div key={skill.id} className="flex items-center gap-4 p-3 border border-border rounded-md">
                  <div className="flex-1">
                    <Label htmlFor={`skill-${index}`}>Skill Name</Label>
                    <Input 
                      id={`skill-${index}`}
                      defaultValue={skill.name} 
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
                      defaultValue={skill.proficiency} 
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
          
          <FormActions />
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSkillsForm;
