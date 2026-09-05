import "react-native-url-polyfill/auto";
import { registerRootComponent } from "expo";
import { installPoppins } from "./src/theme/typography";
import App from "./App";

installPoppins();

registerRootComponent(App);
