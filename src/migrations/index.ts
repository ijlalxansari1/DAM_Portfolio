import * as migration_20261125_130807_initial_archive from './20261125_130807_initial_archive';
import * as migration_20261125_131231_media_storage from './20261125_131231_media_storage';
import * as migration_20261125_140000_search_and_enquiry_limits from './20261125_140000_search_and_enquiry_limits';
import * as migration_20261126_204500_header_social_links from './20261126_204500_header_social_links';
import * as migration_20261126_221500_header_social_column_names from './20261126_221500_header_social_column_names';

export const migrations = [
  {
    up: migration_20261125_130807_initial_archive.up,
    down: migration_20261125_130807_initial_archive.down,
    name: '20261125_130807_initial_archive',
  },
  {
    up: migration_20261125_131231_media_storage.up,
    down: migration_20261125_131231_media_storage.down,
    name: '20261125_131231_media_storage'
  },
  {
    up: migration_20261125_140000_search_and_enquiry_limits.up,
    down: migration_20261125_140000_search_and_enquiry_limits.down,
    name: '20261125_140000_search_and_enquiry_limits',
  },
  {
    up: migration_20261126_204500_header_social_links.up,
    down: migration_20261126_204500_header_social_links.down,
    name: '20261126_204500_header_social_links',
  },
  {
    up: migration_20261126_221500_header_social_column_names.up,
    down: migration_20261126_221500_header_social_column_names.down,
    name: '20261126_221500_header_social_column_names',
  },
];
