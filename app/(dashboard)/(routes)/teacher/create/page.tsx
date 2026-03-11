'use client'

import axios from 'axios'
import {
    Form,
    FormControl,
    FormField,
    FormDescription,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/router'

const CreatePage = () => {
  const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required')
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const { isSubmitting, isValid } = form.formState
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }
  return (
    <div>
      Create Course Page
    </div>
  )
}

export default CreatePage
