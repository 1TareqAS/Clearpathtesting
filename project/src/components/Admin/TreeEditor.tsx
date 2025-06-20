import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Edit, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Category, Scenario } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface TreeEditorProps {
  categories: Category[];
  scenarios: Scenario[];
  onCategoryUpdate: (category: Category) => void;
  onScenarioUpdate: (scenario: Scenario) => void;
  onCategoryDelete: (categoryId: string) => void;
  onScenarioDelete: (scenarioId: string) => void;
}

const TreeEditor: React.FC<TreeEditorProps> = ({
  categories,
  scenarios,
  onCategoryUpdate,
  onScenarioUpdate,
  onCategoryDelete,
  onScenarioDelete
}) => {
  const { state } = useAppContext();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<{ type: 'category' | 'scenario'; id: string } | null>(null);
  const [editForm, setEditForm] = useState({ name: '', nameAR: '', description: '', descriptionAR: '' });
  const isRtl = isRTL(state.language);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const startEditing = (type: 'category' | 'scenario', item: Category | Scenario) => {
    setEditingItem({ type, id: item.id });
    if (type === 'category') {
      const category = item as Category;
      setEditForm({
        name: category.name,
        nameAR: category.nameAR,
        description: category.description,
        descriptionAR: category.descriptionAR
      });
    } else {
      const scenario = item as Scenario;
      setEditForm({
        name: scenario.name,
        nameAR: scenario.nameAR,
        description: '',
        descriptionAR: ''
      });
    }
  };

  const saveEdit = () => {
    if (!editingItem) return;

    if (editingItem.type === 'category') {
      const category = categories.find(c => c.id === editingItem.id);
      if (category) {
        onCategoryUpdate({
          ...category,
          name: editForm.name,
          nameAR: editForm.nameAR,
          description: editForm.description,
          descriptionAR: editForm.descriptionAR
        });
      }
    } else {
      const scenario = scenarios.find(s => s.id === editingItem.id);
      if (scenario) {
        onScenarioUpdate({
          ...scenario,
          name: editForm.name,
          nameAR: editForm.nameAR
        });
      }
    }

    setEditingItem(null);
    setEditForm({ name: '', nameAR: '', description: '', descriptionAR: '' });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({ name: '', nameAR: '', description: '', descriptionAR: '' });
  };

  const onDragEnd = (result: any) => {
    // Handle drag and drop reordering
    console.log('Drag ended:', result);
  };

  return (
    <div className={clsx('space-y-4', isRtl && 'rtl')}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Categories & Scenarios
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-2">
          {categories.map((category) => {
            const categoryScenarios = scenarios.filter(s => s.categoryId === category.id);
            const isExpanded = expandedCategories.includes(category.id);
            const isEditing = editingItem?.type === 'category' && editingItem.id === category.id;

            return (
              <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {/* Category Header */}
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name (English)
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name (Arabic)
                          </label>
                          <input
                            type="text"
                            value={editForm.nameAR}
                            onChange={(e) => setEditForm(prev => ({ ...prev, nameAR: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description (English)
                          </label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description (Arabic)
                          </label>
                          <textarea
                            value={editForm.descriptionAR}
                            onChange={(e) => setEditForm(prev => ({ ...prev, descriptionAR: e.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {state.language === 'AR' ? category.nameAR : category.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {categoryScenarios.length} scenarios
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing('category', category)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onCategoryDelete(category.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scenarios */}
                {isExpanded && !isEditing && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-700 dark:text-gray-300">Scenarios</h5>
                      <button className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                        <Plus className="w-3 h-3" />
                        Add Scenario
                      </button>
                    </div>
                    
                    <Droppable droppableId={`scenarios-${category.id}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {categoryScenarios.map((scenario, index) => {
                            const isScenarioEditing = editingItem?.type === 'scenario' && editingItem.id === scenario.id;
                            
                            return (
                              <Draggable key={scenario.id} draggableId={scenario.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                                  >
                                    {isScenarioEditing ? (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Name (English)
                                            </label>
                                            <input
                                              type="text"
                                              value={editForm.name}
                                              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Name (Arabic)
                                            </label>
                                            <input
                                              type="text"
                                              value={editForm.nameAR}
                                              onChange={(e) => setEditForm(prev => ({ ...prev, nameAR: e.target.value }))}
                                              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                              dir="rtl"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={saveEdit}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={cancelEdit}
                                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div {...provided.dragHandleProps}>
                                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                                          </div>
                                          <span className="text-gray-900 dark:text-white">
                                            {state.language === 'AR' ? scenario.nameAR : scenario.name}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => startEditing('scenario', scenario)}
                                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                                          >
                                            <Edit className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => onScenarioDelete(scenario.id)}
                                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TreeEditor;