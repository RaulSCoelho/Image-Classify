import { Button } from '@/components/button'
import { AIModelIcon } from '@/components/icons/ai-model'
import { PredictIcon } from '@/components/icons/predict'
import { Card, CardBody, CardFooter } from '@nextui-org/react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-default-800 sm:text-4xl">Image Classify</h1>
        <p className="mt-2 text-medium text-default-600 sm:text-large">Upload AI models to predict images</p>
      </div>
      <Card>
        <CardBody className="p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <AIModelIcon className="mb-4 h-24 w-24" />
              <h3 className="text-large font-medium text-default-800">Upload AI Model</h3>
              <p className="mt-2 text-center text-default-600 max-sm:text-sm">Easily upload your trained AI models.</p>
            </div>
            <div className="flex flex-col items-center">
              <PredictIcon className="mb-4 h-24 w-24" />
              <h3 className="text-large font-medium text-default-800">Predict Images</h3>
              <p className="mt-2 text-center text-default-600 max-sm:text-sm">
                Select a model and upload an image for prediction.
              </p>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex-col text-center">
          <p className="mb-2 text-large text-default-800">Ready to get started?</p>
          <Button as={Link} href="/models">
            Upload Model
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
