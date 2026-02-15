import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const useHaptics = () => {
    const impactLight = async () => {
        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch (e) {
            // Ignore errors (e.g. on web/unsupported devices)
        }
    };

    const impactMedium = async () => {
        try {
            await Haptics.impact({ style: ImpactStyle.Medium });
        } catch (e) {
            // Ignore errors
        }
    };

    const impactHeavy = async () => {
        try {
            await Haptics.impact({ style: ImpactStyle.Heavy });
        } catch (e) {
            // Ignore errors
        }
    };

    const notificationSuccess = async () => {
        try {
            await Haptics.notification({ type: NotificationType.Success });
        } catch (e) {
            // Ignore errors
        }
    };

    const notificationError = async () => {
        try {
            await Haptics.notification({ type: NotificationType.Error });
        } catch (e) {
            // Ignore errors
        }
    };

    const vibrate = async () => {
        try {
            await Haptics.vibrate();
        } catch (e) {
            // Ignore errors
        }
    };

    return {
        impactLight,
        impactMedium,
        impactHeavy,
        notificationSuccess,
        notificationError,
        vibrate
    };
};
