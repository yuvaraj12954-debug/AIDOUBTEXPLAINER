import { BookOpen, Lightbulb, Calendar } from 'lucide-react';
import { Doubt } from '../lib/supabase';

interface DoubtCardProps {
  doubt: Doubt;
}

export function DoubtCard({ doubt }: DoubtCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {doubt.subject && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {doubt.subject}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {doubt.input_method}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {doubt.question}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-700">Explanation</h4>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {doubt.explanation}
          </p>
        </div>

        {doubt.example && (
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-700">Example</h4>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {doubt.example}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(doubt.created_at)}</span>
      </div>
    </div>
  );
}
