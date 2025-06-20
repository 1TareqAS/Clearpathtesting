import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Edit, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { UnclearPath, PrimaryOption, SecondaryOption, ResultMapping, Instruction } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface UnclearPathEditorProps {
  unclearPath?: UnclearPath;
  onSave: (unclearPath: UnclearPath) => void;
  onCancel: () => void;
}

const UnclearPathEditor: React.FC<UnclearPathEditorProps> = ({ unclearPath, onSave, onCancel }) => {
  const { state } = useAppContext();
  const [formData, setFormData] = useState<Partial<UnclearPath>>(
    unclearPath || {
      primaryOptions: [],
      secondaryOptions: [],
      resultMappings: []
    }
  );
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary' | 'mappings'>('primary');
  const [editingMapping, setEditingMapping] = useState<string | null>(null);
  const isRtl = isRTL(state.language);

  // Primary Options Management
  const addPrimaryOption = () => {
    const newOption: PrimaryOption = {
      id: `primary-${Date.now()}`,
      label: '',
      labelAR: '',
      order: (formData.primaryOptions?.length || 0) + 1
    };
    setFormData(prev => ({
      ...prev,
      primaryOptions: [...(prev.primaryOptions || []), newOption]
    }));
  };

  const updatePrimaryOption = (id: string, field: keyof PrimaryOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      primaryOptions: prev.primaryOptions?.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      ) || []
    }));
  };

  const removePrimaryOption = (id: string) => {
    setFormData(prev => ({
      ...prev,
      primaryOptions: prev.primaryOptions?.filter(option => option.id !== id) || [],
      resultMappings: prev.resultMappings?.filter(mapping => mapping.primaryOptionId !== id) || []
    }));
  };

  // Secondary Options Management
  const addSecondaryOption = () => {
    const newOption: SecondaryOption = {
      id: `secondary-${Date.now()}`,
      label: '',
      labelAR: '',
      order: (formData.secondaryOptions?.length || 0) + 1
    };
    setFormData(prev => ({
      ...prev,
      secondaryOptions: [...(prev.secondaryOptions || []), newOption]
    }));
  };

  const updateSecondaryOption = (id: string, field: keyof SecondaryOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      secondaryOptions: prev.secondaryOptions?.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      ) || []
    }));
  };

  const removeSecondaryOption = (id: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryOptions: prev.secondaryOptions?.filter(option => option.id !== id) || [],
      resultMappings: prev.resultMappings?.filter(mapping => mapping.secondaryOptionId !== id) || []
    }));
  };

  // Result Mappings Management
  const generateMappings = () => {
    const mappings: ResultMapping[] = [];
    formData.primaryOptions?.forEach(primary => {
      formData.secondaryOptions?.forEach(secondary => {
        const existingMapping = formData.resultMappings?.find(
          m => m.primaryOptionId === primary.id && m.secondaryOptionId === secondary.id
        );
        
        if (!existingMapping) {
          mappings.push({
            id: `mapping-${primary.id}-${secondary.id}`,
            primaryOptionId: primary.id,
            secondaryOptionId: secondary.id,
            instructions: [],
            script: undefined
          });
        }
      });
    });

    setFormData(prev => ({
      ...prev,
      resultMappings: [...(prev.resultMappings || []), ...mappings]
    }));
  };

  const updateMapping = (mappingId: string, field: keyof ResultMapping, value: any) => {
    setFormData(prev => ({
      ...prev,
      resultMappings: prev.resultMappings?.map(mapping => 
        mapping.id === mappingId ? { ...mapping, [field]: value } : mapping
      ) || []
    }));
  };

  const addInstructionToMapping = (mappingId: string) => {
    const newInstruction: Instruction = {
      id: `instruction-${Date.now()}`,
      content: '',
      contentAR: '',
      order: 1,
      type: 'text'
    };

    setFormData(prev => ({
      ...prev,
      resultMappings: prev.resultMappings?.map(mapping => 
        mapping.id === mappingId 
          ? { 
              ...mapping, 
              instructions: [...mapping.instructions, { ...newInstruction, order: mapping.instructions.length + 1 }]
            }
          : mapping
      ) || []
    }));
  };

  const updateInstruction = (mappingId: string, instructionId: string, field: keyof Instruction, value: any) => {
    setFormData(prev => ({
      ...prev,
      resultMappings: prev.resultMappings?.map(mapping => 
        mapping.id === mappingId 
          ? {
              ...mapping,
              instructions: mapping.instructions.map(instruction =>
                instruction.id === instructionId ? { ...instruction, [field]: value } : instruction
              )
            }
          : mapping
      ) || []
    }));
  };

  const removeInstruction = (mappingId: string, instructionId: string) => {
    setFormData(prev => ({
      ...prev,
      resultMappings: prev.resultMappings?.map(mapping => 
        mapping.id === mappingId 
          ? {
              ...mapping,
              instructions: mapping.instructions.filter(instruction => instruction.id !== instructionId)
            }
          : mapping
      ) || []
    }));
  };

  const handleSave = () => {
    const unclearPathData: UnclearPath = {
      id: unclearPath?.id || `unclear-${Date.now()}`,
      primaryOptions: formData.primaryOptions || [],
      secondaryOptions: formData.secondaryOptions || [],
      resultMappings: formData.resultMappings || []
    };
    onSave(unclearPathData);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'primary-options') {
      const items = Array.from(formData.primaryOptions || []);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      
      const reorderedItems = items.map((item, index) => ({ ...item, order: index + 1 }));
      setFormData(prev => ({ ...prev, primaryOptions: reorderedItems }));
    } else if (type === 'secondary-options') {
      const items = Array.from(formData.secondaryOptions || []);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      
      const reorderedItems = items.map((item, index) => ({ ...item, order: index + 1 }));
      setFormData(prev => ({ ...prev, secondaryOptions: reorderedItems }));
    }
  };

  const getPrimaryOptionLabel = (id: string) => {
    const option = formData.primaryOptions?.find(o => o.id === id);
    return option ? (state.language === 'AR' ? option.labelAR : option.label) : 'Unknown';
  };

  const getSecondaryOptionLabel = (id: string) => {
    const option = formData.secondaryOptions?.find(o => o.id === id);
    return option ? (state.language === 'AR' ? option.labelAR : option.label) : 'Unknown';
  };

  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6', isRtl && 'rtl')}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Unclear Path Editor
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
          {[
            { id: 'primary', label: 'Primary Options' },
            { id: 'secondary', label: 'Secondary Options' },
            { id: 'mappings', label: 'Result Mappings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Primary Options Tab */}
        {activeTab === 'primary' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Primary Options</h4>
              <button
                onClick={addPrimaryOption}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="primary-options" type="primary-options">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {formData.primaryOptions?.map((option, index) => (
                      <Draggable key={option.id} draggableId={option.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Option {option.order}
                              </span>
                              <button
                                onClick={() => removePrimaryOption(option.id)}
                                className="ml-auto rtl:ml-0 rtl:mr-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Label (English)
                                </label>
                                <input
                                  type="text"
                                  value={option.label}
                                  onChange={(e) => updatePrimaryOption(option.id, 'label', e.target.value)}
                                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter option label"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Label (Arabic)
                                </label>
                                <input
                                  type="text"
                                  value={option.labelAR}
                                  onChange={(e) => updatePrimaryOption(option.id, 'labelAR', e.target.value)}
                                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="أدخل تسمية الخيار"
                                  dir="rtl"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* Secondary Options Tab */}
        {activeTab === 'secondary' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Secondary Options</h4>
              <button
                onClick={addSecondaryOption}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="secondary-options" type="secondary-options">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {formData.secondaryOptions?.map((option, index) => (
                      <Draggable key={option.id} draggableId={option.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Option {option.order}
                              </span>
                              <button
                                onClick={() => removeSecondaryOption(option.id)}
                                className="ml-auto rtl:ml-0 rtl:mr-auto p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Label (English)
                                </label>
                                <input
                                  type="text"
                                  value={option.label}
                                  onChange={(e) => updateSecondaryOption(option.id, 'label', e.target.value)}
                                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter option label"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Label (Arabic)
                                </label>
                                <input
                                  type="text"
                                  value={option.labelAR}
                                  onChange={(e) => updateSecondaryOption(option.id, 'labelAR', e.target.value)}
                                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="أدخل تسمية الخيار"
                                  dir="rtl"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* Result Mappings Tab */}
        {activeTab === 'mappings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Result Mappings</h4>
              <button
                onClick={generateMappings}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Generate Missing Mappings
              </button>
            </div>

            <div className="space-y-4">
              {formData.resultMappings?.map((mapping) => (
                <div key={mapping.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {getPrimaryOptionLabel(mapping.primaryOptionId)} + {getSecondaryOptionLabel(mapping.secondaryOptionId)}
                    </h5>
                    <button
                      onClick={() => setEditingMapping(editingMapping === mapping.id ? null : mapping.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  {editingMapping === mapping.id && (
                    <div className="space-y-4">
                      {/* Instructions */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructions</h6>
                          <button
                            onClick={() => addInstructionToMapping(mapping.id)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            Add Instruction
                          </button>
                        </div>
                        <div className="space-y-3">
                          {mapping.instructions.map((instruction, index) => (
                            <div key={instruction.id} className="bg-white dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Step {index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={instruction.type}
                                    onChange={(e) => updateInstruction(mapping.id, instruction.id, 'type', e.target.value)}
                                    className="text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1"
                                  >
                                    <option value="text">Text</option>
                                    <option value="action">Action</option>
                                    <option value="warning">Warning</option>
                                    <option value="info">Info</option>
                                  </select>
                                  <button
                                    onClick={() => removeInstruction(mapping.id, instruction.id)}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <textarea
                                  value={instruction.content}
                                  onChange={(e) => updateInstruction(mapping.id, instruction.id, 'content', e.target.value)}
                                  placeholder="Instruction content (English)"
                                  rows={2}
                                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <textarea
                                  value={instruction.contentAR}
                                  onChange={(e) => updateInstruction(mapping.id, instruction.id, 'contentAR', e.target.value)}
                                  placeholder="محتوى التعليمات (العربية)"
                                  rows={2}
                                  dir="rtl"
                                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Script */}
                      <div>
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Script</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Script (English)
                            </label>
                            <textarea
                              value={mapping.script?.content || ''}
                              onChange={(e) => updateMapping(mapping.id, 'script', {
                                ...mapping.script,
                                content: e.target.value,
                                id: mapping.script?.id || `script-${Date.now()}`,
                                title: mapping.script?.title || '',
                                titleAR: mapping.script?.titleAR || '',
                                contentAR: mapping.script?.contentAR || '',
                                category: mapping.script?.category || '',
                                tags: mapping.script?.tags || [],
                                isTemplate: mapping.script?.isTemplate || false,
                                variables: mapping.script?.variables || [],
                                createdAt: mapping.script?.createdAt || new Date(),
                                updatedAt: new Date(),
                                createdBy: mapping.script?.createdBy || 'current-user'
                              })}
                              placeholder="Enter script content..."
                              rows={4}
                              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Script (Arabic)
                            </label>
                            <textarea
                              value={mapping.script?.contentAR || ''}
                              onChange={(e) => updateMapping(mapping.id, 'script', {
                                ...mapping.script,
                                contentAR: e.target.value,
                                id: mapping.script?.id || `script-${Date.now()}`,
                                title: mapping.script?.title || '',
                                titleAR: mapping.script?.titleAR || '',
                                content: mapping.script?.content || '',
                                category: mapping.script?.category || '',
                                tags: mapping.script?.tags || [],
                                isTemplate: mapping.script?.isTemplate || false,
                                variables: mapping.script?.variables || [],
                                createdAt: mapping.script?.createdAt || new Date(),
                                updatedAt: new Date(),
                                createdBy: mapping.script?.createdBy || 'current-user'
                              })}
                              placeholder="أدخل محتوى النص..."
                              rows={4}
                              dir="rtl"
                              className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnclearPathEditor;