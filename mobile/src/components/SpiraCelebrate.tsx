import React from "react";
import { Image, View } from "react-native";

type Props = {
  size?: number;
};

/** Spira 001 — perso seul, fond détouré, sans son. */
export default function SpiraCelebrate({ size = 220 }: Props) {
  return (
    <View style={{ width: size, height: size, backgroundColor: "transparent" }}>
      <Image
        source={require("../../assets/spira/celebrate.webp")}
        style={{ width: size, height: size, backgroundColor: "transparent" }}
        resizeMode="contain"
        accessibilityLabel="Spira"
      />
    </View>
  );
}
