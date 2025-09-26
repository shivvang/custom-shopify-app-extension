import { useEffect, useState } from "react";
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

export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

interface MetafieldResponse {
  data: {
    shop: {
      codeMetafield?: { value: string | null };
      messageMetafield?: { value: string | null };
    };
  };
}

function Extension() {
  const [loading, setLoading] = useState<boolean>(true);
  const [discountCode, setDiscountCode] = useState<string>("THANKYOU15");
  const [message, setMessage] = useState<string>(
    "Special Discount Coupon For Sweet Dreams :"
  );
  const { query } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = (await query(
          `{
          shop {
            codeMetafield: metafield(namespace: "custom", key: "thank_you_code") {
              value
            }
            messageMetafield: metafield(namespace: "custom", key: "thank_you_message") {
              value
            }
          }
        }`
        )) as MetafieldResponse;

        const code = result?.data?.shop?.codeMetafield?.value;
        const msg = result?.data?.shop?.messageMetafield?.value;

        if (code) setDiscountCode(code);
        if (msg) setMessage(msg);
      } catch (error) {
        console.error("Error fetching metafields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    loading ? ( <Banner status="info">
      <InlineStack inlineAlignment="center">
        <BlockStack>
          <Text size="medium" emphasis="bold">
            Fetching your discount...
          </Text>
          <InlineStack inlineAlignment="center" blockAlignment="center">
            <Text size="large" emphasis="bold">
              ⏳ Loading...
            </Text>
          </InlineStack>
        </BlockStack>
      </InlineStack>
    </Banner>) : (
      <BlockStack spacing="base">
      <Banner status="success">
        <InlineStack inlineAlignment={"center"}>
          <BlockStack>
            <Text size="medium" emphasis="bold">
              {message}
            </Text>
            <InlineStack inlineAlignment={"center"} blockAlignment={"center"}>
              <Text size="large" emphasis="bold">
                {discountCode}
              </Text>
              <Button
                activateTarget="discount-code"
                activateAction="copy"
                kind="secondary"
              >
                <Image source={"https://img.icons8.com/small/16/copy.png"} />
              </Button>
            </InlineStack>
          </BlockStack>
        </InlineStack>
      </Banner>
      <ClipboardItem
        id="discount-code"
        text={discountCode}
      />
    </BlockStack>
    )
  );
}
