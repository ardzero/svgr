"use client";
// a share modal with qr, fb, twitter/x, linkedin
import { Img } from "@/components/utils/react-only/Image";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQrCode } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/components/utils/icons";

type ShareModalProps = React.ComponentProps<typeof Drawer> & {
  shareUrl: string;
  sharetoWindow?: boolean;
  twText?: string;
  // change your qr icon in src/components/utils/icons.tsx
  qrIcon?: React.ReactNode;
  title?: string;
};
export function ShareModal({
  children,
  shareUrl,
  sharetoWindow,
  twText,
  qrIcon,
  title = "Share with friends",
  ...props
}: ShareModalProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Copied!",
        description: `URL: ${shareUrl}`,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Error",
        description: "Failed to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: string) => {
    let url = "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const twitterText = twText ? encodeURIComponent(twText) : "";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;

      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodedUrl}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    // Open in a new window with specific dimensions
    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      url,
      "_blank",
      sharetoWindow
        ? `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        : undefined
    );
  };

  const iconClassName = "size-6 md:size-5 fill-foreground";
  const buttonClassName = "grow group";
  return (
    <Drawer {...props}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="max-w-xl mx-auto">
          <div className="p-4 space-y-6 md:flex flex-row-reverse gap-4 place-content-center items-center">
            <div>
              <DrawerTitle className="text-2xl font-medium">
                {title}
              </DrawerTitle>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={shareUrl?.toString()}
                  readOnly
                  className="grow text-xm"
                />
                <Button onClick={copyToClipboard} className="px-6">
                  <Copy className="h-4 w-4 " />
                  Copy
                </Button>
              </div>
              <div className="flex justify-center space-x-4 ">
                <Button
                  onClick={() => shareToSocial("facebook")}
                  variant="outline"
                  className={buttonClassName}
                >
                  <Icons.facebook className={iconClassName} />
                </Button>

                <Button
                  onClick={() => shareToSocial("twitter")}
                  variant="outline"
                  className={buttonClassName}
                >
                  <Icons.twitter className={iconClassName} />
                </Button>
                <Button
                  onClick={() => shareToSocial("linkedin")}
                  variant="outline"
                  className={buttonClassName}
                >
                  <Icons.linkedin className={iconClassName} />
                </Button>
              </div>
            </div>

            <div className="flex justify-center ">
              {qrIcon ? (
                <div className="size-64 md:size-52 ">{qrIcon}</div>
              ) : (
                <Img
                  src={getQrCode(shareUrl)}
                  alt="a2e-qr"
                  className="size-64 md:size-52 dark:invert rounded-xl"
                  width={256}
                  height={256}
                />
              )}
            </div>
          </div>
          <DrawerFooter className="pt-0 mt-0">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
