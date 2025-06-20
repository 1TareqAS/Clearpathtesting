import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Save, X, Copy, Check } from 'lucide-react';
import { Script, ScriptVariable } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import { isRTL } from '../../utils/i18n';
import clsx from 'clsx';

interface ScriptManagerProps {
  script?: Script;
  onSave: (script: Script) => void;
  onCancel: () => void;
}

const ScriptManager: React.FC<ScriptManagerProps> = ({ script, onSave, onCancel }) => {
  const { state } = useAppContext();
  const [formData, setFormData] = useState<Partial<Script>>(
    script || {
      title: '',
      titleAR: '',
      content: '',
      contentAR: '',
      category: '',
      tags: [],
      color: 'blue',
      isTemplate: false,
      variables: []
    }
  );
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'AR'>('EN');
  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState<Partial<ScriptVariable>>({});
  const [copiedScript, setCopiedScript] = useState(false);
  const isRtl = isRTL(state.language);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: activeLanguage === 'EN' ? 'Write your script here...' : 'اكتب النص هنا...'
      })
    ],
    content: activeLanguage === 'EN' ? formData.content : formData.contentAR,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (activeLanguage === 'EN') {
        setFormData(prev => ({ ...prev, content }));
      } else {
        setFormData(prev => ({ ...prev, contentAR: content }));
      }
    }
  });

  React.useEffect(() => {
    if (editor) {
      const content = activeLanguage === 'EN' ? formData.content : formData.contentAR;
      editor.commands.setContent(content || '');
    }
  }, [activeLanguage, editor]);

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addVariable = () => {
    if (newVariable.name && newVariable.placeholder) {
      const variable: ScriptVariable = {
        id: `var-${Date.now()}`,
        name: newVariable.name,
        placeholder: newVariable.placeholder,
        description: newVariable.description || '',
        isRequired: newVariable.isRequired || false
      };
      setFormData(prev => ({
        ...prev,
        variables: [...(prev.variables || []), variable]
      }));
      setNewVariable({});
    }
  };

  const removeVariable = (variableId: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables?.filter(v => v.id !== variableId) || []
    }));
  };

  const handleCopyScript = async () => {
    const content = activeLanguage === 'EN' ? formData.content : formData.contentAR;
    if (content) {
      try {
        // Convert HTML to plain text for copying
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        await navigator.clipboard.writeText(plainText);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      } catch (err) {
        console.error('Failed to copy script:', err);
      }
    }
  };

  const handleSave = () => {
    const scriptData: Script = {
      id: script?.id || `script-${Date.now()}`,
      title: formData.title || '',
      titleAR: formData.titleAR || '',
      content: formData.content || '',
      contentAR: formData.contentAR || '',
      category: formData.category || '',
      tags: formData.tags || [],
      color: formData.color,
      isTemplate: formData.isTemplate || false,
      variables: formData.variables || [],
      createdAt: script?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: script?.createdBy || 'current-user'
    };
    onSave(scriptData);
  };

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' }
  ];

  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6', isRtl && 'rtl')}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {script ? 'Edit Script' : 'Create New Script'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScript}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200',
              copiedScript
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            {copiedScript ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
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

      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter script title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title (Arabic)
              </label>
              <input
                type="text"
                value={formData.titleAR || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, titleAR: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل عنوان النص"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={clsx(
                      'w-8 h-8 rounded-full border-2 transition-all duration-200',
                      color.class,
                      formData.color === color.value
                        ? 'border-gray-900 dark:border-white scale-110'
                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                    )}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isTemplate || false}
                onChange={(e) => setFormData(prev => ({ ...prev, isTemplate: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                This is a template script with variables
              </span>
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Tags</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add
            </button>
          </div>
        </div>

        {/* Variables (if template) */}
        {formData.isTemplate && (
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Template Variables</h4>
            <div className="space-y-3 mb-4">
              {formData.variables?.map((variable) => (
                <div key={variable.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {variable.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {variable.placeholder}
                      </span>
                      {variable.isRequired && (
                        <span className="text-red-500 text-sm ml-1">*</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeVariable(variable.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {variable.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {variable.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Add New Variable</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newVariable.name || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Variable name"
                />
                <input
                  type="text"
                  value={newVariable.placeholder || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, placeholder: e.target.value }))}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Placeholder (e.g., [Customer Name])"
                />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  value={newVariable.description || ''}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description (optional)"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newVariable.isRequired || false}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                </label>
                <button
                  onClick={addVariable}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Add Variable
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">Script Content</h4>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveLanguage('EN')}
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                  activeLanguage === 'EN'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                English
              </button>
              <button
                onClick={() => setActiveLanguage('AR')}
                className={clsx(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
                  activeLanguage === 'AR'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Editor Toolbar */}
          {editor && (
            <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700 p-2 flex items-center gap-2">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={clsx(
                  'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200',
                  editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
                )}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={clsx(
                  'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200',
                  editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
                )}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={clsx(
                  'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200',
                  editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={clsx(
                  'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200',
                  editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                )}
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Editor Content */}
          <div className={clsx(
            'border border-gray-300 dark:border-gray-600 rounded-b-lg bg-white dark:bg-gray-800 min-h-[300px]',
            activeLanguage === 'AR' && 'rtl'
          )}>
            <EditorContent
              editor={editor}
              className="prose prose-sm dark:prose-invert max-w-none p-4 focus:outline-none"
              dir={activeLanguage === 'AR' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptManager;