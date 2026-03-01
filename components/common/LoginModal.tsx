import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { handleGoogleLogin } from "@/lib/firebase/firebase-client"

export default function LoginModal() {
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">লগইন</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Login Your Account</DialogTitle>
          <DialogDescription >
            <Button className="w-full cursor-pointer" variant="outline" type="button" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

{/* <button
                                type='button'
                                onClick={handleGoogleLogin}
                                className='px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-sm'
                            >
                                লগইন
                            </button> */}