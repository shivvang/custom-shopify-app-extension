import  {useState} from "react";
import {
  reactExtension,
  Button,
  BlockStack,
  Text,
  Banner,
  ClipboardItem,
  InlineStack,
  Image,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.thank-you.block.render", () => <Extension />);

function Extension() {
  const [copied, setCopied] = useState(false);
  const discountCode = "THANKYOU15";
  return (
    <BlockStack spacing="base">

      <Banner status="success">
      <InlineStack inlineAlignment={"center"}>
          <BlockStack>
            <Text size="medium" emphasis="bold">
              Special Discount Coupon For Sweet Dreams :
            </Text>
           <InlineStack inlineAlignment={"center"} blockAlignment={"center"}>
              <Text size="large" emphasis="bold">
                  {discountCode}
              </Text>
              <Button  activateTarget="discount-code" activateAction="copy" kind="secondary">
                <Image source={"https://img.icons8.com/small/16/copy.png"}/> 
              </Button>
           </InlineStack>
          </BlockStack>
      </InlineStack>
    </Banner>
      <ClipboardItem
        id="discount-code"
        text={discountCode}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }}
        onCopyError={() => {
          console.error("ClipboardItem copy failed");
        }}
      />

      {copied && (
        <Banner title="Copied!" status="success">
          Discount code copied to your clipboard.
        </Banner>
      )}
    </BlockStack>
  );
}
