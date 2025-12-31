import { NativeModules } from 'react-native';

interface FavoriteConfirmationModuleInterface {
  showToast(message: string): void;
}

const { FavoriteConfirmationModule } = NativeModules;

export default FavoriteConfirmationModule as FavoriteConfirmationModuleInterface;
