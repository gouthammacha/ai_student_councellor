import { supabase } from '../lib/supabase';
import { AssessmentResponse } from '../types/assessment';
import { AnalysisResult } from './cohereService';

export interface AssessmentAttempt {
  id: string;
  created_at: string;
  user_id: string;
  student_name: string;
  responses: AssessmentResponse[];
  analysis: AnalysisResult;
}

export async function saveAssessmentAttempt(
  responses: AssessmentResponse[],
  analysis: AnalysisResult
): Promise<{ data: AssessmentAttempt | null; error: Error | null }> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('No authenticated user');

    // Get student name from responses
    const nameResponse = responses.find(r => r.questionId === 1);
    if (!nameResponse?.answer) {
      throw new Error('Student name is required');
    }

    const { data, error } = await supabase
      .from('assessment_attempts')
      .insert({
        user_id: userData.user.id,
        student_name: nameResponse.answer.toString(),
        responses,
        analysis
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving assessment attempt:', error);
    return { data: null, error: error as Error };
  }
}

export async function getAssessmentAttempts(): Promise<{
  data: AssessmentAttempt[];
  error: Error | null;
}> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching assessment attempts:', error);
    return { data: [], error: error as Error };
  }
}