import { azure } from '@ai-sdk/azure';
import { customProvider,} from "ai";

export const myProvider = customProvider({
      languageModels: {
        "chat-model": azure('o4-mini'),
      },
    });
