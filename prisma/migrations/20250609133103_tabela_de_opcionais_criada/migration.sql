-- CreateTable
CREATE TABLE "menu_item_options_group" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "menu_item_options_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_item_options" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "additionalPrice" DECIMAL(10,2),
    "optionGroupId" INTEGER NOT NULL,

    CONSTRAINT "menu_item_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menu_item_options_group" ADD CONSTRAINT "menu_item_options_group_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_item_options" ADD CONSTRAINT "menu_item_options_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "menu_item_options_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
