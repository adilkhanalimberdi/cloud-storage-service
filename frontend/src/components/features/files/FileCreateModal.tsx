import React from "react";
import { Input } from "../../ui/Input.tsx";
import { Modal } from "../../ui/Modal.tsx";
import { Button } from "../../ui/Button.tsx";
import ReactMarkdown from "react-markdown";

interface FileCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    setFileName: (fileName: string) => void;
    content: string,
    setContent: (content: string) => void;
    onSubmit: (fileName: string, content: string) => void;
    isLoading?: boolean;
    clearForm: () => void;
}

export const FileCreateModal: React.FC<FileCreateModalProps> = ({isOpen, onClose, fileName, setFileName, content, setContent, onSubmit, isLoading, clearForm}) => {
    const isMarkdown = fileName.endsWith(".md") && fileName.trim() !== ".md";

    const handleCreate = () => {
        if (!fileName.trim()) return;
        const finalName = fileName.trim();

        onSubmit(finalName, content);
        clearForm();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create File" maxWidth="6xl">
            <div className="flex flex-col gap-4 h-[65vh]">
                <Input label="File Name"
                       placeholder="e.g. notes.md or document.txt"
                       value={fileName}
                       onChange={(e) => setFileName(e.target.value)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                    <div className="flex flex-col gap-1.5 h-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-zinc-400">Editor</label>
                        <textarea value={content}
                                  onChange={(e) => setContent(e.target.value)}
                                  placeholder="Type your markdown or raw text here..."
                                  className="w-full h-full p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all" />
                    </div>

                    <div className="flex flex-col gap-1.5 h-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-zinc-400">
                            Preview {isMarkdown && <span className="text-indigo-500 text-[10px] ml-1">(Markdown)</span>}
                        </label>

                        <div className="w-full h-full p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 text-sm overflow-y-auto leading-relaxed">
                            {content ? (
                                isMarkdown ? (
                                    <div className="space-y-3 font-sans [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:bg-gray-200 dark:[&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_pre]:bg-gray-200 dark:[&_pre]:bg-zinc-800 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-indigo-500 [&_a]:underline">
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <pre className="font-mono text-sm whitespace-pre-wrap font-normal m-0 p-0 border-none bg-transparent">
                                        {content}
                                    </pre>
                                )
                            ) : (
                                <span className="text-gray-400 dark:text-zinc-600 italic font-sans">
                                    Preview will appear here...
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
                    <Button variant="secondary"
                            onClick={() => {
                                onClose();
                                clearForm();
                            }}
                            disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary"
                            onClick={handleCreate}
                            disabled={!fileName.trim() || isLoading}>
                        {isLoading ? "Saving..." : "Create"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};