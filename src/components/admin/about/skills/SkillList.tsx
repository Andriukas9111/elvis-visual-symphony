
import React from 'react';
import { TechnicalSkillData } from '@/components/home/about/types';
import SkillCard from './SkillCard';
import SkillForm from './SkillForm';

interface SkillListProps {
  skillCategories: TechnicalSkillData[];
  isEditing: string | null;
  editedItem: Partial<TechnicalSkillData>;
  setEditedItem: (item: Partial<TechnicalSkillData>) => void;
  onEdit: (item: TechnicalSkillData) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  editNewSkill: string;
  setEditNewSkill: (skill: string) => void;
  onAddEditSkill: () => void;
  onRemoveEditSkill: (index: number) => void;
}

const SkillList: React.FC<SkillListProps> = ({
  skillCategories,
  isEditing,
  editedItem,
  setEditedItem,
  onEdit,
  onDelete,
  onCancelEdit,
  onSaveEdit,
  editNewSkill,
  setEditNewSkill,
  onAddEditSkill,
  onRemoveEditSkill
}) => {
  return (
    <div className="space-y-4">
      {skillCategories && skillCategories.length > 0 ? (
        skillCategories.map((item) => (
          <React.Fragment key={item.id}>
            {isEditing === item.id ? (
              <SkillForm
                isAddingNew={false}
                skillData={editedItem}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
                onChangeData={setEditedItem}
                newSkill={editNewSkill}
                setNewSkill={setEditNewSkill}
                onAddSkill={onAddEditSkill}
                onRemoveSkill={onRemoveEditSkill}
              />
            ) : (
              <SkillCard
                item={item}
                isEditing={isEditing === item.id}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </React.Fragment>
        ))
      ) : (
        <div className="text-center py-8 border border-dashed rounded-md">
          <p className="text-muted-foreground">No technical skills added yet. Add your first skill category to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SkillList;
