"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { hd } from '@ckb-lumos/lumos'
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const FormSchema = z.object({
  xpubkey: z.string().length(132, {
    message: "xpubkey must be 132 characters. Hex string and start with 0x",
  }),
  addressType: z.string(),
  addressIndex: z.number()
    .int('address index must be an integer')
    .nonnegative('address index must >= 0')
    .default(0),
})

export function XpubkeyForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      xpubkey: "",
      addressType: '0',
      addressIndex: 0,
    },
  })

  const [pkInfo, setPkInfo] = useState<hd.PublicKeyInfo | undefined>()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const account = hd.AccountExtendedPublicKey.parse(data.xpubkey)
      setPkInfo(account.publicKeyInfo(+data.addressType, data.addressIndex))
    } catch {
      toast({
        title: "Generate Failed, Please check the params",
        variant: 'destructive',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 min-w-[400px] space-y-6">
          <FormField
            control={form.control}
            name="xpubkey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>xpubkey</FormLabel>
                <FormControl>
                  <Textarea placeholder="please input xpubkey" {...field} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Type</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="receive" />
                      <Label htmlFor="receive">Receiving</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="change" />
                      <Label htmlFor="change">Change</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addressIndex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Index</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="please input address index" {...field} onChange={e => field.onChange(+e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {
        pkInfo && (
          <div>
            <p>Blake160:<span className="pl-2 text-gray-900 font-bold">{pkInfo.blake160}</span></p>
            <p>Path:<span className="pl-2 text-gray-900 font-bold">{pkInfo.path}</span></p>
            <p>Public Key:<span className="pl-2 text-gray-900 font-bold">{pkInfo.publicKey}</span></p>
          </div>
        )
      }
    </>
  )
}
