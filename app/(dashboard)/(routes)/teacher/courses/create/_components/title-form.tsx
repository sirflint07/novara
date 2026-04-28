'use client'

import { 
    FormItem,
    FormLabel,
    FormDescription,
    FormControl,
    FormField,
    FormMessage
 } from "@/components/ui/form";

 import * as z from 'zod';
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

 const formSchema = z.object({
    title: z.string().min(1,{
        message: "Title is required"
    })
})

 interface TitleFormProps {
    initialData?: {
        title: string
    }
    courseId: string
 }

 const TitleForm = ({courseId, initialData}: TitleFormProps) => {

 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
 })

 const [editing, setEditing] = useState<false | true>(false)

 return (
    <div className="p-6">
       
    </div>
    )
 }

 export default TitleForm;