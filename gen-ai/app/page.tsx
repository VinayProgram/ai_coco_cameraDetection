'use client'
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import * as qa from '@tensorflow-models/qna'
import { QuestionAndAnswer } from '@tensorflow-models/qna'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

const Home = () => {
  const [model, setModel] = React.useState<QuestionAndAnswer | null>(null)
  const [learningText, setLearningText] = React.useState<string>('')
  const [question, setQuestion] = React.useState<string>('')
  const [answer, setAnswer] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    loadModel()
  }, [])

  async function loadModel() {
    try {
      const m = await qa.load()
      setModel(m)
    } catch (error) {
      console.error('Error loading model:', error)
    }
  }

  async function getAnswers() {
    if (model && question && learningText) {
      setLoading(true)
      try {
        const answers = await model.findAnswers(question, learningText)
        setAnswer(answers[0]?.text || 'No answer found')
      } catch (error) {
        console.error('Error getting answers:', error)
        setAnswer('Error retrieving answer')
      } finally {
        setLoading(false)
      }
    } else {
      setAnswer('Please provide both text and a question.')
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-textPrimary flex items-center justify-center">
      <Card className="max-w-lg p-8 space-y-6 shadow-lg rounded-xl bg-[#121212]">
        <CardHeader className='text-textPrimary'>
          <h1 className="text-3xl font-bold text-center textPrimary">AI Question Answering</h1>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter learning text here"
            value={learningText}
            onChange={(e) => setLearningText(e.currentTarget.value)}
            className="w-full h-32 bg-[#2D2D2D] text-textPrimary placeholder:text-textSecondary border border-[#3B3B3B] rounded-lg p-4"
          />
          <Input
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.currentTarget.value)}
            className="w-full bg-[#2D2D2D] text-textPrimary placeholder:text-textSecondary border border-[#3B3B3B] rounded-lg p-4 mt-4"
          />
          <Button
            onClick={getAnswers}
            className="w-full bg-accent text-white py-3 mt-6 rounded-lg hover:bg-lightAccent transition-all duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Answer'}
          </Button>
          {answer && (
            <div className="mt-4 text-textPrimary p-4 bg-[#2D2D2D] border border-[#3B3B3B] rounded-lg">
              <h3 className="font-semibold text-lg">Answer:</h3>
              <p className="text-sm">{answer}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Home
