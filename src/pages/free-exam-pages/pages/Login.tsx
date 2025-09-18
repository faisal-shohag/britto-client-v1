import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import { use, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FreeUserContext } from "@/context/FreeUser.context";

const FormSchema = z.object({
  phone: z.string().min(11, {
    message: "সঠিকভাবে তোমার নম্বরটি দাও...",
  }),
});

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {setUser} = use(FreeUserContext) as any
  const location = useLocation()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    const res = await api.get(`/freeUser/${data.phone}`);
    const user = res.data.result;
    if (!user) {
        setLoading(false)
      toast("তোমার ফোন নম্বরটি রেজিস্টারড নয়।", {
        description: (
          <div className="text-red-500">
            তোমার নম্বরটি সঠিকভাবে দিয়েছো কিনা check করো!
          </div>
        ),
        
      });

      return
    }
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
    navigate(location?.state?.from || '/free')




    // toast("You submitted the following values", {
    //   description: (
    //     <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <div className="mx-auto max-w-3xl bg-green-100/35 dark:bg-zinc-800 shadow-2xl p-5  w-full rounded-xl text-center">
      <Form {...form}>
        <h1 className="text-2xl font-bold">প্রবেশ করো</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex flex-col justify-center items-center gap-5 mt-5"
        >
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>তোমার মোবাইল নম্বর</FormLabel>
                <FormControl>
                  <InputOTP maxLength={11} {...field}>
                    <InputOTPGroup className="bg-white dark:bg-zinc-900 rounded-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                      <InputOTPSlot index={8} />
                      <InputOTPSlot index={9} />
                      <InputOTPSlot index={10} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="bg-green-600" type="submit">
           {loading ? ' লগইন হচ্ছে...' : ' লগইন'}
          </Button>

          <div className="text-sm">
            <span className="text-green-500">এখনো জয়েন হওনি? </span>
            <a target="__blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdMiJzSZREoHy3pAxJO0sSZ40yrFpgSxVhWF3If__NXwcntFQ/viewform"><span className="text-pink-500 underline">এখানে ক্লিক করে তোমার ইনফো দাও! </span></a>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Login;
