import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_TRANSFORM_KEY = 'skipResponseTransform';

/** Use for raw responses (files, webhooks) that must not be wrapped. */
export const SkipResponseTransform = () =>
  SetMetadata(SKIP_RESPONSE_TRANSFORM_KEY, true);
