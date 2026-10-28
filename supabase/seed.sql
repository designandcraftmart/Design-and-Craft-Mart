-- DCM seed data. Prices are PLACEHOLDERS - replace in the admin area later.

insert into public.categories (slug, name_en, name_bn, sort_order) values
  ('photo-frames', 'Photo Frames', 'ফটো ফ্রেম',    1),
  ('mugs',         'Mugs',         'মগ',            2),
  ('t-shirts',     'T-shirts',     'টি-শার্ট',      3),
  ('custom-gifts', 'Custom Gifts', 'কাস্টম গিফট',   4)
on conflict (slug) do nothing;

insert into public.products (category_id, slug, name_en, name_bn, desc_en, desc_bn, base_price, is_custom, is_featured, stock_status, tags)
select c.id, v.slug, v.name_en, v.name_bn, v.desc_en, v.desc_bn, v.price, v.is_custom, v.is_featured, v.stock::public.stock_status, v.tags
from (values
  ('photo-frames','calendar-heart-frame','Heart Calendar Photo Frame','হার্ট ক্যালেন্ডার ফটো ফ্রেম',
   'A heart-shaped frame with a calendar, made with your favorite photo.','আপনার প্রিয় ছবি দিয়ে তৈরি হার্ট আকৃতির ক্যালেন্ডার ফ্রেম।',
   500, true, true, 'made_to_order', array['anniversary','calendar']),
  ('photo-frames','classic-wood-frame','Classic Wooden Photo Frame','ক্লাসিক কাঠের ফটো ফ্রেম',
   'A clean wooden frame for a memory you want to keep on display.','স্মৃতি সাজিয়ে রাখার জন্য সাধারণ ও সুন্দর কাঠের ফ্রেম।',
   400, true, false, 'made_to_order', array['birthday','frame']),
  ('mugs','photo-mug','Personalized Photo Mug','ফটো মগ',
   'A white ceramic mug printed with your photo and message.','আপনার ছবি ও বার্তা প্রিন্ট করা সাদা সিরামিক মগ।',
   350, true, true, 'made_to_order', array['birthday','mom']),
  ('mugs','magic-color-mug','Magic Color-Changing Mug','ম্যাজিক মগ',
   'Turns from black to your photo when a hot drink is poured in.','গরম পানীয় ঢাললে কালো মগে আপনার ছবি ফুটে ওঠে।',
   450, true, false, 'in_stock', array['surprise','friend']),
  ('t-shirts','custom-photo-tshirt','Custom Photo T-shirt','কাস্টম ফটো টি-শার্ট',
   'A soft cotton t-shirt printed with your photo or design.','আপনার ছবি বা ডিজাইন প্রিন্ট করা নরম কটন টি-শার্ট।',
   650, true, true, 'made_to_order', array['couple','birthday']),
  ('custom-gifts','name-gift-box','Custom Name Gift Box','নামসহ গিফট বক্স',
   'A gift box with a name and a short message of your choice.','আপনার পছন্দের নাম ও ছোট বার্তাসহ গিফট বক্স।',
   800, true, false, 'made_to_order', array['gift','anniversary'])
) as v(cat, slug, name_en, name_bn, desc_en, desc_bn, price, is_custom, is_featured, stock, tags)
join public.categories c on c.slug = v.cat
on conflict (slug) do nothing;

-- One sample option so the product page has something to show.
insert into public.product_options (product_id, name_en, name_bn, values)
select p.id, 'Size', 'সাইজ',
  '[{"value_en":"S","value_bn":"এস","price_add":0},{"value_en":"M","value_bn":"এম","price_add":0},{"value_en":"L","value_bn":"এল","price_add":0},{"value_en":"XL","value_bn":"এক্সএল","price_add":50}]'::jsonb
from public.products p
where p.slug = 'custom-photo-tshirt'
  and not exists (select 1 from public.product_options o where o.product_id = p.id);

insert into public.site_settings (key, value) values
  ('phone',     '"01645-070698"'),
  ('whatsapp',  '"+880 1634-361396"'),
  ('email',     '"designandcraftmart@gmail.com"'),
  ('facebook',  '{"name":"Design & Craft Mart","url":null}'),
  ('instagram', '{"handle":"designandcraftmart","url":"https://www.instagram.com/designandcraftmart/"}')
on conflict (key) do nothing;
