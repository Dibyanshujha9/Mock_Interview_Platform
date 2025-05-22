// "use client"

// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Form } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import Image from 'next/image'
// import Link from 'next/link'
// import { toast } from "sonner"
// import FormField from "./FormField"
// import { useRouter } from "next/navigation"
// import { createUserWithEmailAndPassword, onIdTokenChanged, signInWithEmailAndPassword } from "firebase/auth"
// import { auth } from "@/firebase/client"

// // Define schema outside without using router
// const authFormSchema = (type) => {
//   return z.object({
//     name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
//     email: z.string().email(),
//     password: z.string().min(3),
//   });
// };

// const AuthForm = ({ type }: { type: FormType }) => {
//   const router = useRouter();
//   const formSchema = authFormSchema(type);
  
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });
  
//   // Submit handler
//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       if(type === "sign-up"){
//         // console.log("sign up", values);

// const { name , email , password } = values;
// const userCredentials = await createUserWithEmailAndPassword(auth , email , password);

// const result = await signUp ({
//   uid : userCredentials.user.uid,
//   name: name!,
//   email,
//   password,
// })

// if(!result?.success){
//         toast.error(result.message);
//         return;
//       }

//       toast.success("Account created successfully");
//       router.push("/sign-in");
//       }

//       else{
// const {email , password} = values;

// const userCredentials = await signInWithEmailAndPassword(auth , email , password);

// const idToken = await userCredentials.user.getIdToken();

// if(!idToken){
//   toast.error("Invalid credentials");
//   return;
// }

// await signIn({
//   email , idToken 
// })

//         // console.log("sign in", values);
//         toast.success("Logged in successfully");
//         router.push("/");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(`Something went wrong: ${error}`);
//     }
//   }

//   const isSignIn = type === "sign-in";
//   const isSignUp = type === "sign-up";
  
//   return (
//     <div className="card-border lg:min-w-[566px]">
//       <div className="flex flex-col gap-6 card py-14 px-10">
//         <div className="flex flex-row gap-2 justify-center">
//           <Image src="/logo.svg" alt="Logo" width={32} height={38} />
//           <h2 className="text-primary-100">PrepHub</h2>
//         </div>
//         <h3>AI-Powered Interview Practice</h3>
        
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <div className="w-full space-y-6 mt-4 form"></div>
//             {!isSignIn && <FormField control={form.control} name="name" label="Name" placeholder="Enter your name" />}
//             <FormField control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
//             <FormField control={form.control} name="password" label="Password" placeholder="Enter your password" type="password" />
            
//             <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
//           </form>
//         </Form>

//         <p className="text-center">
//           {isSignIn ? "No account yet?" : "Have an account already?"}{" "}
//           <Link
//             href={!isSignIn ? "/sign-in" : "/sign-up"}
//             className="font-bold text-user-primary ml-1"
//           >
//             {!isSignIn ? "Sign In" : "Sign Up"}
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default AuthForm


"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;